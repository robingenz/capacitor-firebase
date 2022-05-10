package dev.robingenz.capacitorjs.plugins.firebase.authentication.handlers;

import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.auth.OAuthCredential;
import dev.robingenz.capacitorjs.plugins.firebase.authentication.FirebaseAuthentication;
import dev.robingenz.capacitorjs.plugins.firebase.authentication.R;
import dev.robingenz.capacitorjs.plugins.firebase.authentication.models.AdditionalUserInfo;

public class GoogleAuthProviderHandler {

    private FirebaseAuthentication pluginImplementation;
    private GoogleSignInClient mGoogleSignInClient;

    public GoogleAuthProviderHandler(FirebaseAuthentication pluginImplementation) {
        this.pluginImplementation = pluginImplementation;
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(pluginImplementation.getPlugin().getContext().getString(R.string.default_web_client_id))
            .requestEmail()
            .build();
        mGoogleSignInClient = GoogleSignIn.getClient(pluginImplementation.getPlugin().getActivity(), gso);
    }

    public void signIn(PluginCall call) {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        pluginImplementation.startActivityForResult(call, signInIntent, "handleGoogleAuthProviderActivityResult");
    }

    public void signOut() {
        mGoogleSignInClient.signOut();
    }

    public void handleOnActivityResult(PluginCall call, ActivityResult result) {
        Intent data = result.getData();
        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            String idToken = account.getIdToken();
            String userId = account.getId();
            String email = account.getEmail();
            AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
            pluginImplementation.handleSuccessfulSignIn(call, credential, idToken, new AdditionalUserInfo(userId, email));
        } catch (ApiException exception) {
            pluginImplementation.handleFailedSignIn(call, null, exception);
        }
    }
}
