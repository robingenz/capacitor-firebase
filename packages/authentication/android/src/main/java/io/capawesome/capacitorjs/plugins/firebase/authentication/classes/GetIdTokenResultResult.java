package io.capawesome.capacitorjs.plugins.firebase.authentication.classes;

import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.google.firebase.auth.GetTokenResult;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.Result;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class GetIdTokenResultResult implements Result {

    @Nullable
    private GetTokenResult tokenResult;

    private SimpleDateFormat iso8601Format;

    public GetIdTokenResultResult(@Nullable GetTokenResult tokenResult) {
        this.tokenResult = tokenResult;
        this.iso8601Format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        this.iso8601Format.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    public JSObject toJSObject() {
        JSObject result = new JSObject();
        if (tokenResult != null) {
            result.put("authTime", iso8601Format.format(new Date(tokenResult.getAuthTimestamp() * 1000L)));
            result.put("expirationTime", iso8601Format.format(new Date(tokenResult.getExpirationTimestamp() * 1000L)));
            result.put("issuedAtTime", iso8601Format.format(new Date(tokenResult.getIssuedAtTimestamp() * 1000L)));
            result.put("signInProvider", tokenResult.getSignInProvider());
            result.put("signInSecondFactor", tokenResult.getSignInSecondFactor());

            JSObject claims = new JSObject();
            for (String key : tokenResult.getClaims().keySet()) {
                claims.put(key, tokenResult.getClaims().get(key));
            }
            result.put("claims", claims);
        }
        return result;
    }
}
