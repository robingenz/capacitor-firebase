package io.capawesome.capacitorjs.plugins.firebase.analytics;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.Bridge;
import org.json.JSONObject;

public class FirebaseAnalytics {

    private final com.google.firebase.analytics.FirebaseAnalytics analyticsInstance;
    private final Bridge bridge;

    public FirebaseAnalytics(Context context, Bridge bridge) {
        this.analyticsInstance = com.google.firebase.analytics.FirebaseAnalytics.getInstance(context);
        this.bridge = bridge;
    }

    @Nullable
    public void getAppInstanceId(@NonNull final GetAppInstanceIdCallback resultCallback) {
        this.analyticsInstance.getAppInstanceId()
            .addOnCompleteListener(
                task -> {
                    if (!task.isSuccessful()) {
                        Exception exception = task.getException();
                        Log.w(FirebaseAnalyticsPlugin.TAG, "Get AppInstanceId failed.", exception);
                        resultCallback.error(exception.getLocalizedMessage());
                        return;
                    }

                    String appInstanceId = task.getResult();
                    resultCallback.success(appInstanceId);
                }
            );
    }

    public void setUserId(@Nullable String userId) {
        analyticsInstance.setUserId(userId);
    }

    public void setUserProperty(@NonNull String key, @Nullable String value) {
        analyticsInstance.setUserProperty(key, value);
    }

    public void setCurrentScreen(String screenName, String screenClass) {
        Bundle bundle = new Bundle();
        bundle.putString(com.google.firebase.analytics.FirebaseAnalytics.Param.SCREEN_NAME, screenName);
        bundle.putString(com.google.firebase.analytics.FirebaseAnalytics.Param.SCREEN_CLASS, screenClass);

        bridge
            .getActivity()
            .runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        analyticsInstance.logEvent(com.google.firebase.analytics.FirebaseAnalytics.Event.SCREEN_VIEW, bundle);
                    }
                }
            );
    }

    public void logEvent(@NonNull String key, @Nullable JSONObject json) {
        Bundle bundle = FirebaseAnalyticsHelper.createBundleFromJson(json);
        analyticsInstance.logEvent(key, bundle);
    }

    public void setSessionTimeoutDuration(long duration) {
        analyticsInstance.setSessionTimeoutDuration(duration);
    }

    public void setEnabled(boolean enabled) {
        analyticsInstance.setAnalyticsCollectionEnabled(enabled);
    }

    public void resetAnalyticsData() {
        analyticsInstance.resetAnalyticsData();
    }
}
