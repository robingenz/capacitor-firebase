package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.fields;

import static com.google.firebase.firestore.FieldValue.arrayRemove;
import static com.google.firebase.firestore.FieldValue.arrayUnion;
import static com.google.firebase.firestore.FieldValue.delete;
import static com.google.firebase.firestore.FieldValue.increment;
import static com.google.firebase.firestore.FieldValue.serverTimestamp;

import androidx.annotation.NonNull;
import io.capawesome.capacitorjs.plugins.firebase.firestore.FirebaseFirestoreHelper;
import io.capawesome.capacitorjs.plugins.firebase.firestore.enums.FieldValueMethod;
import org.json.JSONException;
import org.json.JSONObject;

public class FieldValue {

    @NonNull
    FieldValueMethod method;

    Object[] args;

    public FieldValue(@NonNull FieldValueMethod method, Object[] args) {
        this.method = method;
        this.args = args;
    }

    public static FieldValue fromJSONObject(@NonNull JSONObject value) throws JSONException {
        return new FieldValue(
            FieldValueMethod.fromString(value.getString("method")),
            FirebaseFirestoreHelper.createArrayListFromJSONArray(value.getJSONArray("args")).toArray()
        );
    }

    public Object getField() {
        return switch (method) {
            case ARRAY_REMOVE -> arrayRemove(this.args);
            case ARRAY_UNION -> arrayUnion(this.args);
            case DELETE_FIELD -> delete();
            case INCREMENT -> this.args[0] instanceof Double
                ? increment((Double) this.args[0])
                : increment(((Integer) this.args[0]).longValue());
            case SERVER_TIMESTAMP -> serverTimestamp();
            default -> null;
        };
    }
}
