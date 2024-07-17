package io.capawesome.capacitorjs.plugins.firebase.firestore;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.google.firebase.firestore.DocumentSnapshot;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints.QueryCompositeFilterConstraint;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints.QueryEndAtConstraint;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints.QueryLimitConstraint;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints.QueryOrderByConstraint;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints.QueryStartAtConstraint;
import io.capawesome.capacitorjs.plugins.firebase.firestore.classes.fields.FirestoreField;
import io.capawesome.capacitorjs.plugins.firebase.firestore.interfaces.QueryNonFilterConstraint;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class FirebaseFirestoreHelper {

    public static HashMap<String, Object> createHashMapFromJSONObject(JSONObject object) throws JSONException {
        HashMap<String, Object> map = new HashMap<>();
        Iterator<String> keys = object.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = createObjectFromJSValue(object.get(key));
            map.put(key, value);
        }
        return map;
    }

    @Nullable
    public static JSObject createJSObjectFromMap(@Nullable Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        JSObject object = new JSObject();
        for (String key : map.keySet()) {
            Object value = map.get(key);
            if (value instanceof ArrayList) {
                value = createJSArrayFromArrayList((ArrayList) value);
            } else if (value instanceof Map) {
                value = createJSObjectFromMap((Map<String, Object>) value);
            }
            object.put(key, parseObject(value));
        }
        return object;
    }

    public static Object createObjectFromJSValue(Object value) throws JSONException {
        if (value.toString().equals("null")) {
            return null;
        } else if (value instanceof JSONObject) {
            return createObjectFromJSONObject((JSONObject) value);
        } else if (value instanceof JSONArray) {
            return createArrayListFromJSONArray((JSONArray) value);
        } else {
            return value;
        }
    }

    @Nullable
    public static QueryCompositeFilterConstraint createQueryCompositeFilterConstraintFromJSObject(@Nullable JSObject compositeFilter)
        throws JSONException {
        if (compositeFilter == null) {
            return null;
        } else {
            return new QueryCompositeFilterConstraint(compositeFilter);
        }
    }

    @NonNull
    public static QueryNonFilterConstraint[] createQueryNonFilterConstraintArrayFromJSArray(@Nullable JSArray queryConstraints)
        throws JSONException {
        if (queryConstraints == null) {
            return new QueryNonFilterConstraint[0];
        } else {
            QueryNonFilterConstraint[] queryNonFilterConstraint = new QueryNonFilterConstraint[queryConstraints.length()];
            for (int i = 0; i < queryConstraints.length(); i++) {
                JSObject queryConstraint = JSObject.fromJSONObject(queryConstraints.getJSONObject(i));
                String queryConstraintType = queryConstraint.getString("type");
                switch (queryConstraintType) {
                    case "orderBy":
                        queryNonFilterConstraint[i] = new QueryOrderByConstraint(queryConstraint);
                        break;
                    case "limit":
                        queryNonFilterConstraint[i] = new QueryLimitConstraint(queryConstraint);
                        break;
                    case "startAt":
                    case "startAfter":
                        queryNonFilterConstraint[i] = new QueryStartAtConstraint(queryConstraint);
                        break;
                    case "endAt":
                    case "endBefore":
                        queryNonFilterConstraint[i] = new QueryEndAtConstraint(queryConstraint);
                        break;
                }
            }
            return queryNonFilterConstraint;
        }
    }

    private static ArrayList<Object> createArrayListFromJSONArray(JSONArray array) throws JSONException {
        ArrayList<Object> arrayList = new ArrayList<>();
        for (int x = 0; x < array.length(); x++) {
            Object value = array.get(x);
            if (value instanceof JSONObject) {
                value = createObjectFromJSONObject((JSONObject) value);
            } else if (value instanceof JSONArray) {
                value = createArrayListFromJSONArray((JSONArray) value);
            }
            arrayList.add(value);
        }
        return arrayList;
    }

    private static JSArray createJSArrayFromArrayList(ArrayList arrayList) {
        JSArray array = new JSArray();
        for (Object value : arrayList) {
            if (value instanceof Map) {
                value = createJSObjectFromMap((Map<String, Object>) value);
            }
            array.put(parseObject(value));
        }
        return array;
    }

    public static JSObject createSnapshotMetadataResult(DocumentSnapshot snapshot) {
        final JSObject obj = new JSObject();
        obj.put("fromCache", snapshot.getMetadata().isFromCache());
        obj.put("hasPendingWrites", snapshot.getMetadata().hasPendingWrites());
        return obj;
    }
    
    private static Object createObjectFromJSONObject(@NonNull JSONObject object) throws JSONException {
        if (FirestoreField.isFirestoreField(object)) {
            FirestoreField field = FirestoreField.fromJSONObject(object);
            return field.getField();
        }

        return createHashMapFromJSONObject(object);
    }

    /**
     * Parse an object to return it's firestore field value. Else return the same object.
     */
    private static Object parseObject(@NonNull Object object) {
        try {
            return FirestoreField.fromObject(object).getJSObject();
        } catch (Exception e) {}

        return object;
    }
}
