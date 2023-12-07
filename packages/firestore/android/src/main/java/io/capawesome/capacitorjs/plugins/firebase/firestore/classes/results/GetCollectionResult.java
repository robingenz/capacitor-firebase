package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.results;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.json.JSONObject;

import io.capawesome.capacitorjs.plugins.firebase.firestore.FirebaseFirestoreHelper;
import io.capawesome.capacitorjs.plugins.firebase.firestore.interfaces.Result;

public class GetCollectionResult implements Result {

    private QuerySnapshot querySnapshot;

    public GetCollectionResult(QuerySnapshot querySnapshot) {
        this.querySnapshot = querySnapshot;
    }

    @Override
    public JSObject toJSObject() {
        JSArray snapshotsResult = new JSArray();
        for (QueryDocumentSnapshot document : querySnapshot) {
            JSObject snapshotDataResult = FirebaseFirestoreHelper.createJSObjectFromMap(document.getData());

            JSObject snapshotResult = new JSObject();
            snapshotResult.put("id", document.getId());
            snapshotResult.put("path", document.getReference().getPath());
            if (dataResult == null) {
                snapshotResult.put("data", JSONObject.NULL);
            } else {
                snapshotResult.put("data", dataResult);
            }
            snapshotsResult.put(snapshotResult);
        }

        JSObject result = new JSObject();
        result.put("snapshots", snapshotsResult);
        return result;
    }
}
