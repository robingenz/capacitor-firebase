package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.fields;

import androidx.annotation.NonNull;

import org.json.JSONException;
import org.json.JSONObject;

import io.capawesome.capacitorjs.plugins.firebase.firestore.enums.FieldValueMethod;

public class FieldValue {

    @NonNull
    FieldValueMethod method;

    public FieldValue(@NonNull FieldValueMethod method) {
        this.method = method;
    }

    public static FieldValue fromJSONObject(@NonNull JSONObject value) throws JSONException {
        return new FieldValue(
            FieldValueMethod.fromString(value.getString("method"))
        );
    }

    public Object getField() {
        switch (method) {
            case CREATE_SERVER_TIMESTAMP:
                return com.google.firebase.firestore.FieldValue.serverTimestamp();
            default:
                return null;
        }
    }
}
