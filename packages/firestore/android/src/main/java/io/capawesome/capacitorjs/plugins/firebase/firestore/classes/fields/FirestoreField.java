package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.fields;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;

import org.json.JSONException;
import org.json.JSONObject;

import io.capawesome.capacitorjs.plugins.firebase.firestore.enums.FirestoreFieldType;

public class FirestoreField {

    @NonNull
    private FirestoreFieldType type;

    @NonNull
    private JSONObject value;

    private static final String FIRESTORE_FIELD_TYPE = "_capacitorFirestoreFieldType";
    private static final String FIRESTORE_FIELD_VALUE = "_capacitorFirestoreFieldValue";

    /**
     * Is a JSONObject a serialized Firestore field
     * @param firestoreFieldData
     * @return
     */
    public static boolean isFirestoreField(JSONObject firestoreFieldData) {
        if (!firestoreFieldData.has(FIRESTORE_FIELD_TYPE)) {
            return false;
        }
        return true;
    }

    public FirestoreField(FirestoreFieldType type, JSONObject value) {
        this.type = type;
        this.value = value;
    }

    public static FirestoreField fromJSONObject(JSONObject data) throws JSONException {
        FirestoreFieldType type = FirestoreFieldType.fromString((String) data.get(FIRESTORE_FIELD_TYPE));
        JSONObject value = (JSONObject) data.get(FIRESTORE_FIELD_VALUE);
        return new FirestoreField(type, value);
    }

    public static FirestoreField fromObject(Object object) throws IllegalArgumentException {
        if (object instanceof com.google.firebase.Timestamp) {
            Timestamp timestamp = Timestamp.fromFirestore((com.google.firebase.Timestamp) object);
            return new FirestoreField(FirestoreFieldType.TIMESTAMP, timestamp.getValue());
        }
        throw new IllegalArgumentException("The provided object is not a firestore field");
    }

    public Object getField() throws JSONException {
        switch(type) {
            case FIELD_VALUE:
                return FieldValue.fromJSONObject(value).getField();
            case TIMESTAMP:
                return Timestamp.fromJSONObject(value).getField();
            default:
                return null;
        }
    }

    public JSObject getJSObject() throws JSONException {
        JSObject object = new JSObject();
        object.put(FIRESTORE_FIELD_TYPE, type.toString());
        object.put(FIRESTORE_FIELD_VALUE, JSObject.fromJSONObject(value));
        return object;
    }
}
