package gdscskku.teletect;

import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import org.json.JSONObject;

@CapacitorPlugin(name = "PermissionHandleController")
public class PermissionHandlePlugin extends Plugin {

    @PluginMethod()
    public void checkRequiredPermissions(PluginCall call) {
        JSObject returnJSObject = new JSObject();
        ArrayList<String> deniedPermissions = new ArrayList<>();


        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            deniedPermissions.add("READ_SMS");
        }

        if (deniedPermissions.size() > 0) {
            returnJSObject.put("status", "denied");
            // String[] deniedPermissionsArray = new String[deniedPermissions.size()];
            // deniedPermissionsArray = deniedPermissions.toArray(deniedPermissionsArray);
            // returnJSObject.put("deniedPermissions", deniedPermissionsArray);
        } else {
            returnJSObject.put("status", "granted");
        }
        call.resolve(returnJSObject);
    }

    @PluginMethod()
    public void requestRequiredPermissions(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.READ_SMS}, 0);
        }
    }

    
}