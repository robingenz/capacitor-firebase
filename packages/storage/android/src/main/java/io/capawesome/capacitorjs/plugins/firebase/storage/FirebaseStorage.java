package io.capawesome.capacitorjs.plugins.firebase.storage;

import android.net.Uri;
import androidx.annotation.NonNull;
import com.google.firebase.storage.StorageMetadata;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.events.UploadFileCallbackEvent;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.DeleteFileOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.GetDownloadUrlOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.GetMetadataOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.ListFilesOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.UpdateMetadataOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.options.UploadFileOptions;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.results.GetDownloadUrlResult;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.results.GetMetadataResult;
import io.capawesome.capacitorjs.plugins.firebase.storage.classes.results.ListFilesResult;
import io.capawesome.capacitorjs.plugins.firebase.storage.enums.UploadFileState;
import io.capawesome.capacitorjs.plugins.firebase.storage.interfaces.EmptyResultCallback;
import io.capawesome.capacitorjs.plugins.firebase.storage.interfaces.NonEmptyResultCallback;

public class FirebaseStorage {

    private FirebaseStoragePlugin plugin;
    private com.google.firebase.storage.FirebaseStorage firebaseStorageInstance;

    public FirebaseStorage(FirebaseStoragePlugin plugin) {
        this.plugin = plugin;
        firebaseStorageInstance = com.google.firebase.storage.FirebaseStorage.getInstance();
    }

    public void deleteFile(@NonNull DeleteFileOptions options, @NonNull EmptyResultCallback callback) {
        String path = options.getPath();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        storageReference
            .delete()
            .addOnSuccessListener(aVoid -> callback.success())
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void getDownloadUrl(@NonNull GetDownloadUrlOptions options, @NonNull NonEmptyResultCallback callback) {
        String path = options.getPath();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        storageReference
            .getDownloadUrl()
            .addOnSuccessListener(
                uri -> {
                    GetDownloadUrlResult result = new GetDownloadUrlResult(uri);
                    callback.success(result);
                }
            )
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void getMetadata(@NonNull GetMetadataOptions options, @NonNull NonEmptyResultCallback callback) {
        String path = options.getPath();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        storageReference
            .getMetadata()
            .addOnSuccessListener(
                storageMetadata -> {
                    GetMetadataResult result = new GetMetadataResult(storageMetadata);
                    callback.success(result);
                }
            )
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void listFiles(@NonNull ListFilesOptions options, @NonNull NonEmptyResultCallback callback) {
        String path = options.getPath();
        int maxResults = options.getMaxResults();
        String pageToken = options.getPageToken();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        storageReference
            .list(maxResults, pageToken)
            .addOnSuccessListener(
                listResult -> {
                    ListFilesResult result = new ListFilesResult(listResult);
                    callback.success(result);
                }
            )
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void updateMetadata(@NonNull UpdateMetadataOptions options, @NonNull EmptyResultCallback callback) {
        String path = options.getPath();
        StorageMetadata metadata = options.getMetadata();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        storageReference
            .updateMetadata(metadata)
            .addOnSuccessListener(aVoid -> callback.success())
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void uploadFile(@NonNull UploadFileOptions options, @NonNull NonEmptyResultCallback callback) {
        String path = options.getPath();
        Uri uri = options.getUri();

        StorageReference storageReference = firebaseStorageInstance.getReference(path);
        UploadTask uploadTask = storageReference.putFile(uri);
        uploadTask
            .addOnCanceledListener(
                () -> {
                    UploadFileCallbackEvent result = new UploadFileCallbackEvent(null, UploadFileState.CANCELED);
                    callback.success(result);
                }
            )
            .addOnProgressListener(
                taskSnapshot -> {
                    UploadFileCallbackEvent result = new UploadFileCallbackEvent(taskSnapshot, UploadFileState.RUNNING);
                    callback.success(result);
                }
            )
            .addOnPausedListener(
                taskSnapshot -> {
                    UploadFileCallbackEvent result = new UploadFileCallbackEvent(taskSnapshot, UploadFileState.PAUSED);
                    callback.success(result);
                }
            )
            .addOnSuccessListener(
                taskSnapshot -> {
                    UploadFileCallbackEvent result = new UploadFileCallbackEvent(taskSnapshot, UploadFileState.SUCCESS);
                    callback.success(result);
                }
            )
            .addOnFailureListener(exception -> callback.error(exception));
    }
}
