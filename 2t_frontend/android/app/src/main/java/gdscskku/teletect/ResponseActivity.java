package gdscskku.teletect;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageButton;

public class ResponseActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Handler를 사용하여 10초 지연 후 로직 실행
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // 10초 지연 후 실행될 코드
                setContentView(R.layout.response); // response.xml 레이아웃과 연결

                // 전화 받기 버튼 찾기
                ImageButton answerButton = findViewById(R.id.answerButton);
                // 전화 받기 버튼 클릭 이벤트 설정
                answerButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        // CallingActivity 시작
                        Intent intent = new Intent(ResponseActivity.this, CallingActivity.class);
                        startActivity(intent);
                        // after calling activity, finish this activity
                        finish();
                    }
                });

                // 전화 끊기 버튼 찾기
                ImageButton declineButton = findViewById(R.id.declineButton);
                // 전화 끊기 버튼 클릭 이벤트 설정
                declineButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        // 현재 액티비티 종료하여 이전 화면으로 돌아가기
                        finish();
                    }
                });
            }
        }, 10000); // 10초 지연
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
