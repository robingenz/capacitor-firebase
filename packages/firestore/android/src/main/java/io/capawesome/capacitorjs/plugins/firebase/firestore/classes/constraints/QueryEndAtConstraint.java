package io.capawesome.capacitorjs.plugins.firebase.firestore.classes.constraints;

import com.getcapacitor.JSObject;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.Query;

import java.util.concurrent.ExecutionException;

import io.capawesome.capacitorjs.plugins.firebase.firestore.interfaces.QueryNonFilterConstraint;

public class QueryEndAtConstraint implements QueryNonFilterConstraint {

    private String type;
    private String reference;

    public QueryEndAtConstraint(JSObject queryConstraint) {
        this.type = queryConstraint.getString("type");
        this.reference = queryConstraint.getString("reference");
    }

    public String getReference() {
        return reference;
    }

    public Query toQuery(Query query, com.google.firebase.firestore.FirebaseFirestore firestoreInstance) throws Exception {
        Task<DocumentSnapshot> task = firestoreInstance.document(reference).get();
        DocumentSnapshot documentSnapshot = Tasks.await(task);
        if (type.equals("endAt")) {
            return query.endAt(documentSnapshot);
        } else {
            return query.endBefore(documentSnapshot);
        }
    }
}
