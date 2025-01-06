package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.fields;

import androidx.annotation.NonNull;
import org.json.JSONException;
import org.json.JSONObject;

public class Timestamp {

    long seconds;

    int nanoseconds;

    public Timestamp(long seconds, int nanoseconds) {
        this.seconds = seconds;
        this.nanoseconds = nanoseconds;
    }

    public static Timestamp fromJSONObject(@NonNull JSONObject value) throws JSONException {
        return new Timestamp(((Number) value.get("seconds")).longValue(), (int) value.get("nanoseconds"));
    }

    public static Timestamp fromFirestore(@NonNull com.google.firebase.Timestamp timestamp) {
        return new Timestamp(timestamp.getSeconds(), timestamp.getNanoseconds());
    }

    @NonNull
    public JSONObject getValue() {
        JSONObject value = new JSONObject();
        try {
            value.put("seconds", seconds);
            value.put("nanoseconds", nanoseconds);
        } catch (JSONException e) {}
        return value;
    }

    public com.google.firebase.Timestamp getField() throws JSONException {
        return new com.google.firebase.Timestamp(seconds, nanoseconds);
    }
}
