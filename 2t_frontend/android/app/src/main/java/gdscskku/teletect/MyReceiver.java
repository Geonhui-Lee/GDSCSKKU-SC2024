package gdscskku.teletect;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.icu.text.SimpleDateFormat;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyReceiver extends BroadcastReceiver {
    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Handler handler = new Handler(Looper.getMainLooper());

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
            if (messages != null) {
                for (SmsMessage smsMessage : messages) {
                    String messageBody = smsMessage.getMessageBody();
                    if (messageBody != null) {
                        handleSmsMessage(context, messageBody); // 항상 메세지 수신 시 handleSmsMessage 호출
                    } else {
                        Log.d("MyReceiver", "SMS message body is null.");
                    }
                }
            } else {
                Log.d("MyReceiver", "No SMS messages received or messages array is null.");
            }
        }
    }

    private void handleSmsMessage(Context context, String messageBody) {
        executorService.execute(() -> {
            try {
                String encodedText = URLEncoder.encode(messageBody, "UTF-8");
                URL url = new URL("http://10.0.2.2:8000/detection/kobert?text=" + encodedText);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");

                if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        response.append(line);
                    }
                    br.close();

                    JSONObject jsonResponse = new JSONObject(response.toString());
                    double score = jsonResponse.getDouble("score");

                    handler.post(() -> {
                        if (score >= 0.8) {
                            Log.d("MyReceiver", "Detected SMS phishing attempt with score: " + score);
                            // JSON 파일 작성 로직 시작
                            try {
                                JSONObject recordJson = new JSONObject();
                                recordJson.put("score", score);
                                recordJson.put("messageBody", messageBody);

                                SimpleDateFormat sdf = null;
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                    sdf = new SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault());
                                }
                                String fileName = null;
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                    fileName = "PhishingDetection_" + sdf.format(new Date()) + ".json";
                                }

                                // 외부 저장소에 저장하는 대신 앱의 내부 저장소를 사용
                                File file = new File(context.getFilesDir(), fileName);
                                FileWriter writer = new FileWriter(file);
                                writer.write(recordJson.toString(4)); // JSON을 보기 좋게 포맷팅
                                writer.flush();
                                writer.close();

                                Log.d("MyReceiver", "Phishing detection record saved: " + file.getAbsolutePath());
                            } catch (Exception e) {
                                Log.e("MyReceiver", "Failed to save phishing detection record: " + e.getMessage(), e);
                            }
                            // JSON 파일 작성 로직 종료
                        } else {
                            Log.d("MyReceiver", "SMS not detected as phishing with score: " + score);
                        }
                    });
                } else {
                    Log.e("MyReceiver", "Server responded with HTTP error code: " + conn.getResponseCode());
                }
            } catch (Exception e) {
                Log.e("MyReceiver", "SmsPhishingDetectionTask failed: " + e.getMessage(), e);
            }
        });
    }


}
