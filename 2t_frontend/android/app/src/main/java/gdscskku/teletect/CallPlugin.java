package gdscskku.teletect;

import android.content.Intent;
import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "CallController")
public class CallPlugin extends Plugin {

    @PluginMethod()
    public void call(PluginCall call) {
        // CallingActivity를 시작합니다.
        Intent callingIntent = new Intent(getContext(), CallingActivity.class);
        getContext().startActivity(callingIntent);

        call.resolve();
    }
}
