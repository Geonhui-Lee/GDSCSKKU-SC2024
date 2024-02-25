package gdscskku.teletect;

import android.content.Intent;
import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ResponseController")
public class ResponsePlugin extends Plugin {

    @PluginMethod()
    public void response(PluginCall call) {
        // ResponseActivity를 시작합니다.
        Intent ResponseActivityIntent = new Intent(getContext(), ResponseActivity.class);
        getContext().startActivity(ResponseActivityIntent);

        call.resolve();
    }
}
