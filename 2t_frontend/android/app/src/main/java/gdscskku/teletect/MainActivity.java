package gdscskku.teletect;

import android.content.IntentFilter;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PermissionHandlePlugin.class);
        registerPlugin(CallPlugin.class);
        registerPlugin(ResponsePlugin.class);
        registerPlugin(SmsInboxReaderPlugin.class);

        super.onCreate(savedInstanceState);
    }
}