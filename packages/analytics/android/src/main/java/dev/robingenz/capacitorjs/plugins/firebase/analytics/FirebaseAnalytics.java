package dev.robingenz.capacitorjs.plugins.firebase.analytics;

import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import org.json.JSONObject;

public class FirebaseAnalytics {

    private final com.google.firebase.analytics.FirebaseAnalytics analyticsInstance;

    public FirebaseAnalytics(Context context) {
        this.analyticsInstance = com.google.firebase.analytics.FirebaseAnalytics.getInstance(context);
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
        analyticsInstance.logEvent(com.google.firebase.analytics.FirebaseAnalytics.Event.SCREEN_VIEW, bundle);
    }

    public void logEvent(@NonNull String key, JSONObject json) {
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
