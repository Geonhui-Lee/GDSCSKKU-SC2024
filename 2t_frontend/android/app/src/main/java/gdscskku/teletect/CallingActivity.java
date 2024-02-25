package gdscskku.teletect;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.icu.text.SimpleDateFormat;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HttpsURLConnection;

public class CallingActivity extends Activity {
    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
    private TextView callTime, transcriptionText;
    private int seconds = 0;
    private boolean running;
    private ScheduledExecutorService executorService;
    private LinearLayout callInfoContainer;
    private TextView callStatus;

    private LinearLayout callBackgroundContainer;
    private TextView callBackgroundStatus;

    private MediaRecorder recorder;
    private String fileName = null;

    private SpeechRecognizer speechRecognizer;
    private Intent recognizerIntent;

    static private String speechToTextTranscript = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.calling);

        callTime = findViewById(R.id.callTime);
        transcriptionText = findViewById(R.id.transcriptionText);
        callInfoContainer = findViewById(R.id.callInfoContainer);
        callStatus = findViewById(R.id.callStatus);
        callBackgroundContainer = findViewById(R.id.callBackgroundContainer);
        callBackgroundStatus = findViewById(R.id.callBackgroundStatus);
        ImageButton endCallButton = findViewById(R.id.endCallButton);

        setupTimer();
        setupWarningHandler();
        setupEndCallButton(endCallButton);
        speechToTextTranscript = "";

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO_PERMISSION);
        } else {
            setupSpeechRecognizer();
        }
    }

    private void setupTimer() {
        running = true;
        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> {
            int hours = seconds / 3600;
            int minutes = (seconds % 3600) / 60;
            int secs = seconds % 60;
            String time = String.format("%02d:%02d:%02d", hours, minutes, secs);
            runOnUiThread(() -> callTime.setText(time));
            seconds++;
        }, 0, 1, TimeUnit.SECONDS);
    }

    private void setupWarningHandler() {
        // This method's functionality is now embedded within the phishing detection logic.
    }

    private void setupEndCallButton(ImageButton endCallButton) {
        endCallButton.setOnClickListener(v -> {
            stopRecording();
            finish();
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                setupSpeechRecognizer();
            } else {
                showPermissionRationale();
            }
        }
    }

    private void showPermissionRationale() {
        new AlertDialog.Builder(this)
                .setTitle("Audio Recording Permission Required")
                .setMessage("This app needs audio recording permission to function properly.")
                .setPositiveButton("Retry", (dialog, which) -> ActivityCompat.requestPermissions(CallingActivity.this, new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO_PERMISSION))
                .setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss())
                .create()
                .show();
    }

    private void setupSpeechRecognizer() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, this.getPackageName());
        speechRecognizer.setRecognitionListener(new RecognitionListenerAdapter());
        speechRecognizer.startListening(recognizerIntent);
    }

    private class RecognitionListenerAdapter implements RecognitionListener {
        @Override
        public void onReadyForSpeech(Bundle params) {}

        @Override
        public void onBeginningOfSpeech() {}

        @Override
        public void onRmsChanged(float rmsdB) {}

        @Override
        public void onBufferReceived(byte[] buffer) {}

        @Override
        public void onEndOfSpeech() {
            speechRecognizer.startListening(recognizerIntent);
        }

        @Override
        public void onError(int error) {
            Log.e("CallingActivity", "SpeechRecognizer error: " + error);
            speechRecognizer.startListening(recognizerIntent);
        }

        @Override
        public void onResults(Bundle results) {
            ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            if (matches != null && !matches.isEmpty()) {
                String text = matches.get(0);
                transcriptionText.setText(text);
                new VoicePhishingDetectionTask().execute(text);
            }
        }

        @Override
        public void onPartialResults(Bundle partialResults) {}

        @Override
        public void onEvent(int eventType, Bundle params) {}
    }

    @SuppressLint("StaticFieldLeak")
    private class VoicePhishingDetectionTask extends AsyncTask<String, Void, Double> {
        @Override
        protected Double doInBackground(String... strings) {
            try {
                // 직접 인코딩된 텍스트 예시로 확인
                String testText = "it%20is%20test%20text";

                // 실제 사용할 텍스트 인코딩
                String text = strings[0];
                speechToTextTranscript = speechToTextTranscript + " " + text;
                String encodedText = URLEncoder.encode(speechToTextTranscript, "UTF-8");
                URL url_vertexai = new URL("http://10.0.2.2:8000/detection/vertexai?text=" + encodedText);
                HttpURLConnection conn_vertexai = (HttpURLConnection) url_vertexai.openConnection();
                conn_vertexai.setRequestMethod("GET");

                if (conn_vertexai.getResponseCode() == HttpURLConnection.HTTP_OK) {
                    BufferedReader br_vertexai = new BufferedReader(new InputStreamReader(conn_vertexai.getInputStream()));
                    StringBuilder response_vertexai = new StringBuilder();
                    String line_vertexai;
                    while ((line_vertexai = br_vertexai.readLine()) != null) {
                        response_vertexai.append(line_vertexai);
                    }
                    br_vertexai.close();
                    JSONObject vertexAIJsonResponse = new JSONObject(response_vertexai.toString());

                    double vertexAIScore = vertexAIJsonResponse.getDouble("score");
                    if (vertexAIScore >= 0.8) return vertexAIScore;

                    URL url_kobert = new URL("http://10.0.2.2:8000/detection/kobert?text=" + encodedText);
                    HttpURLConnection conn_kobert = (HttpURLConnection) url_kobert.openConnection();
                    conn_kobert.setRequestMethod("GET");

                    if (conn_vertexai.getResponseCode() == HttpURLConnection.HTTP_OK) {
                        BufferedReader br_kobert = new BufferedReader(new InputStreamReader(conn_vertexai.getInputStream()));
                        StringBuilder response_kobert = new StringBuilder();
                        String line_kobert;
                        while ((line_kobert = br_kobert.readLine()) != null) {
                            response_kobert.append(line_kobert);
                        }
                        br_kobert.close();
                        JSONObject kobertJsonResponse = new JSONObject(response_kobert.toString());

                        double kobertScore = kobertJsonResponse.getDouble("score");
                        return kobertScore;
                    }
                }
            } catch (Exception e) {
                Log.e("CallingActivity", "VoicePhishingDetectionTask failed: " + e.getMessage());
            }
            return null;
        }

        @SuppressLint("SetTextI18n")
        @Override
        protected void onPostExecute(Double score) {
            super.onPostExecute(score);
            if (score != null && score >= 0.8) {
                callInfoContainer.setBackgroundColor(Color.parseColor("#ffd534"));
                callStatus.setText("Warning");
                callBackgroundStatus.setText("A potential scam call has been detected.");
                callBackgroundStatus.setTextColor(Color.parseColor("#ff4961"));
                // ProtectorRecord 생성 및 JSON 파일로 저장
                try {
                    JSONObject recordJson = new JSONObject();
                    recordJson.put("type", "call");
                    recordJson.put("score", score);

                    JSONObject timeJson = new JSONObject();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                        timeJson.put("created", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).format(new Date()));
                    }
                    recordJson.put("time", timeJson);

                    JSONObject contactJson = new JSONObject();
                    contactJson.put("name", "John Doe"); // 연락처 정보 설정 필요
                    contactJson.put("phoneNumber", "+1234567890"); // 연락처 정보 설정 필요
                    recordJson.put("contact", contactJson);

                    JSONObject callDataJson = new JSONObject();
                    callDataJson.put("callDuration", seconds);
                    callDataJson.put("suspiciousParts", new ArrayList<String>()); // 의심스러운 부분 목록
                    recordJson.put("data", callDataJson);

                    String fileName = null;
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                        fileName = "ProtectorRecord_" + new SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault()).format(new Date()) + ".json";
                    }
                    File file = new File(getExternalFilesDir(null), fileName);
                    FileWriter writer = new FileWriter(file);
                    writer.write(recordJson.toString(4)); // 보기 좋게 포맷팅
                    writer.flush();
                    writer.close();

                    Log.d("CallingActivity", "ProtectorRecord saved: " + file.getAbsolutePath());
                } catch (Exception e) {
                    Log.e("CallingActivity", "Failed to save ProtectorRecord: " + e.getMessage());
                }
            }
        }
    }

    // ProtectorRecord 및 관련 클래스 정의
    class ProtectorRecord {
        String id;
        String type;
        ProtectorTime time;
        double score;
        ContactManifest contact;
        ProtectorRecordCallData data;

        static class ProtectorTime {
            Date created;
            Date modified;
        }
    }

    class ContactManifest {
        String name;
        String phoneNumber;

        ContactManifest(String name, String phoneNumber) {
            this.name = name;
            this.phoneNumber = phoneNumber;
        }

        public ContactManifest() {

        }
    }

    class ProtectorRecordCallData {
        int callDuration;
        ArrayList<String> suspiciousParts;
    }

    private void startRecording() {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        fileName = getExternalCacheDir().getAbsolutePath() + "/audiorecordtest.3gp";
        recorder.setOutputFile(fileName);

        try {
            recorder.prepare();
            recorder.start();
        } catch (IOException | IllegalStateException e) {
            Log.e("CallingActivity", "Recorder prepare/start failed: " + e.getMessage());
        }
    }

    private void stopRecording() {
        if (recorder != null) {
            try {
                recorder.stop();
            } catch (RuntimeException stopException) {
                Log.e("CallingActivity", "Stop failed: " + stopException.getMessage());
            } finally {
                recorder.release();
                recorder = null;
            }
            Log.d("CallingActivity", "Recording stopped and saved to: " + fileName);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdownNow();
        }
        if (running) {
            stopRecording();
        }
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
    }
}
