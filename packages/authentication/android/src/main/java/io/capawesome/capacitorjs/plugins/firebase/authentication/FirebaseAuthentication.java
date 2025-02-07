package io.capawesome.capacitorjs.plugins.firebase.authentication;

import static io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin.ERROR_NO_USER_SIGNED_IN;
import static io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin.TAG;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.PluginCall;
import com.google.android.gms.auth.api.identity.AuthorizationResult;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.AdditionalUserInfo;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.EmailAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GetTokenResult;
import com.google.firebase.auth.UserProfileChangeRequest;
import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationHelper.ProviderId;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.ConfirmVerificationCodeOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.GetIdTokenResult;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.GetIdTokenResultResult;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.LinkWithPhoneNumberOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.PhoneVerificationCompletedEvent;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.SignInOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.SignInResult;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.SignInWithPhoneNumberOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.FetchSignInMethodsForEmailOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.RevokeAccessTokenOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.SendEmailVerificationOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.SendPasswordResetEmailOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.results.FetchSignInMethodsForEmailResult;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.AppleAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.FacebookAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.GoogleAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.OAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.PhoneAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.PlayGamesAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.EmptyResultCallback;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.NonEmptyResultCallback;
import java.util.Arrays;
import java.util.List;
import org.json.JSONObject;

public class FirebaseAuthentication {

    private FirebaseAuthenticationPlugin plugin;
    private FirebaseAuthenticationConfig config;
    private FirebaseAuth.AuthStateListener firebaseAuthStateListener;
    private FirebaseAuth.IdTokenListener firebaseIdTokenChangeListener;
    private AppleAuthProviderHandler appleAuthProviderHandler;
    private FacebookAuthProviderHandler facebookAuthProviderHandler;
    private GoogleAuthProviderHandler googleAuthProviderHandler;
    public ActivityResultLauncher<IntentSenderRequest> googleAuthorizationResultLauncher;
    private OAuthProviderHandler oAuthProviderHandler;
    private PhoneAuthProviderHandler phoneAuthProviderHandler;
    private PlayGamesAuthProviderHandler playGamesAuthProviderHandler;

    public FirebaseAuthentication(FirebaseAuthenticationPlugin plugin, FirebaseAuthenticationConfig config) {
        this.plugin = plugin;
        this.config = config;
        this.initAuthProviderHandlers(config);
        this.firebaseAuthStateListener = firebaseAuth -> {
            this.plugin.handleAuthStateChange();
        };
        getFirebaseAuthInstance().addAuthStateListener(this.firebaseAuthStateListener);
        this.firebaseIdTokenChangeListener = firebaseAuth -> {
            this.plugin.handleIdTokenChange();
        };
        getFirebaseAuthInstance().addIdTokenListener(this.firebaseIdTokenChangeListener);
    }

    public void applyActionCode(@NonNull String oobCode, @NonNull Runnable callback) {
        getFirebaseAuthInstance()
            .applyActionCode(oobCode)
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void createUserWithEmailAndPassword(PluginCall call) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_SIGN_IN_SKIP_NATIVE_AUTH);
            return;
        }

        String email = call.getString("email");
        if (email == null) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_MISSING);
            return;
        }
        String password = call.getString("password");
        if (password == null) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_PASSWORD_MISSING);
            return;
        }

        getFirebaseAuthInstance()
            .createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = getCurrentUser();
                    JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(user, null, null, null, null, null);
                    call.resolve(signInResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void confirmPasswordReset(@NonNull String oobCode, @NonNull String newPassword, @NonNull Runnable callback) {
        getFirebaseAuthInstance()
            .confirmPasswordReset(oobCode, newPassword)
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void confirmVerificationCode(@NonNull ConfirmVerificationCodeOptions options, @NonNull NonEmptyResultCallback callback) {
        phoneAuthProviderHandler.confirmVerificationCode(options, callback);
    }

    public void deleteUser(FirebaseUser user, @NonNull Runnable callback) {
        user
            .delete()
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void fetchSignInMethodsForEmail(FetchSignInMethodsForEmailOptions options, @NonNull final NonEmptyResultCallback callback) {
        String email = options.getEmail();

        getFirebaseAuthInstance()
            .fetchSignInMethodsForEmail(email)
            .addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    List<String> signInMethods = task.getResult().getSignInMethods();
                    FetchSignInMethodsForEmailResult result = new FetchSignInMethodsForEmailResult(signInMethods);
                    callback.success(result);
                } else {
                    Exception exception = task.getException();
                    callback.error(exception);
                }
            });
    }

    @Nullable
    public FirebaseUser getCurrentUser() {
        return getFirebaseAuthInstance().getCurrentUser();
    }

    public void getIdToken(Boolean forceRefresh, @NonNull final NonEmptyResultCallback callback) {
        FirebaseUser user = getCurrentUser();
        if (user == null) {
            callback.error(new Exception(ERROR_NO_USER_SIGNED_IN));
            return;
        }
        Task<GetTokenResult> tokenResultTask = user.getIdToken(forceRefresh);
        tokenResultTask.addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                String token = task.getResult().getToken();
                GetIdTokenResult result = new GetIdTokenResult(token);
                callback.success(result);
            } else {
                Exception exception = task.getException();
                callback.error(exception);
            }
        });
    }

    public void getIdTokenResult(Boolean forceRefresh, @NonNull final NonEmptyResultCallback callback) {
        FirebaseUser user = getCurrentUser();
        if (user == null) {
            callback.error(new Exception(ERROR_NO_USER_SIGNED_IN));
            return;
        }
        Task<GetTokenResult> idTokenResultTask = user.getIdToken(forceRefresh);
        idTokenResultTask.addOnCompleteListener(
            task -> {
                if (task.isSuccessful()) {
                    GetTokenResult tokenResult = task.getResult();
                    GetIdTokenResultResult result = new GetIdTokenResultResult(tokenResult);
                    callback.success(result);
                } else {
                    Exception exception = task.getException();
                    callback.error(exception);
                }
            }
        );
    }

    public void getPendingAuthResult(PluginCall call) {
        oAuthProviderHandler.getPendingAuthResult(call);
    }

    @Nullable
    public String getTenantId() {
        return getFirebaseAuthInstance().getTenantId();
    }

    public boolean isSignInWithEmailLink(@NonNull String emailLink) {
        return getFirebaseAuthInstance().isSignInWithEmailLink(emailLink);
    }

    public void linkWithApple(final PluginCall call) {
        appleAuthProviderHandler.link(call);
    }

    public void linkWithEmailAndPassword(final PluginCall call) {
        boolean skipNativeAuth = this.config.getSkipNativeAuth();
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_LINK_SKIP_NATIVE_AUTH);
            return;
        }
        FirebaseUser user = getCurrentUser();
        if (user == null) {
            call.reject(ERROR_NO_USER_SIGNED_IN);
            return;
        }

        String email = call.getString("email", "");
        String password = call.getString("password", "");

        AuthCredential credential = EmailAuthProvider.getCredential(email, password);

        user
            .linkWithCredential(credential)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    JSObject linkResult = FirebaseAuthenticationHelper.createSignInResult(user, null, null, null, null, null);
                    call.resolve(linkResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void linkWithEmailLink(final PluginCall call) {
        boolean skipNativeAuth = this.config.getSkipNativeAuth();
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_LINK_SKIP_NATIVE_AUTH);
            return;
        }
        FirebaseUser user = getCurrentUser();
        if (user == null) {
            call.reject(ERROR_NO_USER_SIGNED_IN);
            return;
        }

        String email = call.getString("email", "");
        String emailLink = call.getString("emailLink", "");

        AuthCredential credential = EmailAuthProvider.getCredentialWithLink(email, emailLink);

        user
            .linkWithCredential(credential)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    JSObject linkResult = FirebaseAuthenticationHelper.createSignInResult(user, null, null, null, null, null);
                    call.resolve(linkResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void linkWithFacebook(final PluginCall call) {
        facebookAuthProviderHandler.link(call);
    }

    public void linkWithGithub(final PluginCall call) {
        oAuthProviderHandler.link(call, ProviderId.GITHUB);
    }

    public void linkWithGoogle(final PluginCall call) {
        googleAuthProviderHandler.link(call);
    }

    public void linkWithMicrosoft(final PluginCall call) {
        oAuthProviderHandler.link(call, ProviderId.MICROSOFT);
    }

    public void linkWithOpenIdConnect(final PluginCall call, final String providerId) {
        oAuthProviderHandler.link(call, providerId);
    }

    public void linkWithPhoneNumber(@NonNull final LinkWithPhoneNumberOptions options) throws Exception {
        phoneAuthProviderHandler.link(options);
    }

    public void linkWithPlayGames(final PluginCall call) {
        playGamesAuthProviderHandler.link(call);
    }

    public void linkWithTwitter(final PluginCall call) {
        oAuthProviderHandler.link(call, ProviderId.TWITTER);
    }

    public void linkWithYahoo(final PluginCall call) {
        oAuthProviderHandler.link(call, ProviderId.YAHOO);
    }

    public void reload(FirebaseUser user, @NonNull Runnable callback) {
        user
            .reload()
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void revokeAccessToken(@NonNull RevokeAccessTokenOptions options, @NonNull EmptyResultCallback callback) {
        String token = options.getToken();

        getFirebaseAuthInstance()
            .revokeAccessToken(token)
            .addOnSuccessListener(unused -> callback.success())
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void sendEmailVerification(@NonNull SendEmailVerificationOptions options, @NonNull EmptyResultCallback callback) {
        ActionCodeSettings actionCodeSettings = options.getActionCodeSettings();

        FirebaseUser user = getCurrentUser();
        if (user == null) {
            Exception exception = new Exception(ERROR_NO_USER_SIGNED_IN);
            callback.error(exception);
            return;
        }

        Task<Void> task = null;
        if (actionCodeSettings == null) {
            task = user.sendEmailVerification();
        } else {
            task = user.sendEmailVerification(actionCodeSettings);
        }
        task.addOnSuccessListener(unused -> callback.success()).addOnFailureListener(exception -> callback.error(exception));
    }

    public void sendPasswordResetEmail(@NonNull SendPasswordResetEmailOptions options, @NonNull EmptyResultCallback callback) {
        String email = options.getEmail();
        ActionCodeSettings actionCodeSettings = options.getActionCodeSettings();

        getFirebaseAuthInstance()
            .sendPasswordResetEmail(email, actionCodeSettings)
            .addOnSuccessListener(unused -> callback.success())
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void sendSignInLinkToEmail(@NonNull String email, @NonNull ActionCodeSettings actionCodeSettings, @NonNull Runnable callback) {
        getFirebaseAuthInstance()
            .sendSignInLinkToEmail(email, actionCodeSettings)
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void setLanguageCode(String languageCode) {
        getFirebaseAuthInstance().setLanguageCode(languageCode);
    }

    public void setTenantId(String tenantId) {
        getFirebaseAuthInstance().setTenantId(tenantId);
    }

    public void signInAnonymously(final PluginCall call) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_SIGN_IN_ANONYMOUSLY_SKIP_NATIVE_AUTH);
            return;
        }
        getFirebaseAuthInstance()
            .signInAnonymously()
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    AuthResult authResult = task.getResult();
                    JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(
                        authResult.getUser(),
                        authResult.getCredential(),
                        null,
                        null,
                        null,
                        authResult.getAdditionalUserInfo()
                    );
                    call.resolve(signInResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void signInWithApple(final PluginCall call) {
        appleAuthProviderHandler.signIn(call);
    }

    public void signInWithEmailAndPassword(final PluginCall call) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_SIGN_IN_SKIP_NATIVE_AUTH);
            return;
        }

        String email = call.getString("email", "");
        String password = call.getString("password", "");

        getFirebaseAuthInstance()
            .signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = getCurrentUser();
                    JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(user, null, null, null, null, null);
                    call.resolve(signInResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void signInWithEmailLink(final PluginCall call) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_EMAIL_LINK_SIGN_IN_SKIP_NATIVE_AUTH);
            return;
        }

        String email = call.getString("email", "");
        String emailLink = call.getString("emailLink", "");

        getFirebaseAuthInstance()
            .signInWithEmailLink(email, emailLink)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    AuthResult authResult = task.getResult();
                    JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(
                        authResult.getUser(),
                        authResult.getCredential(),
                        null,
                        null,
                        null,
                        authResult.getAdditionalUserInfo()
                    );
                    call.resolve(signInResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void signInWithFacebook(final PluginCall call) {
        facebookAuthProviderHandler.signIn(call);
    }

    public void signInWithGithub(final PluginCall call) {
        oAuthProviderHandler.signIn(call, ProviderId.GITHUB);
    }

    public void signInWithGoogle(final PluginCall call) {
        googleAuthProviderHandler.signIn(call);
    }

    public void signInWithMicrosoft(final PluginCall call) {
        oAuthProviderHandler.signIn(call, ProviderId.MICROSOFT);
    }

    public void signInWithOpenIdConnect(final PluginCall call, final String providerId) {
        oAuthProviderHandler.signIn(call, providerId);
    }

    public void signInWithPhoneNumber(final SignInWithPhoneNumberOptions options) throws Exception {
        phoneAuthProviderHandler.signIn(options);
    }

    public void signInWithPlayGames(final PluginCall call) {
        playGamesAuthProviderHandler.signIn(call);
    }

    public void signInWithTwitter(final PluginCall call) {
        oAuthProviderHandler.signIn(call, ProviderId.TWITTER);
    }

    public void signInWithYahoo(final PluginCall call) {
        oAuthProviderHandler.signIn(call, ProviderId.YAHOO);
    }

    public void signInWithCustomToken(final PluginCall call) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            call.reject(FirebaseAuthenticationPlugin.ERROR_CUSTOM_TOKEN_SKIP_NATIVE_AUTH);
            return;
        }

        String token = call.getString("token", "");

        getFirebaseAuthInstance()
            .signInWithCustomToken(token)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = getCurrentUser();
                    JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(user, null, null, null, null, null);
                    call.resolve(signInResult);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void signOut(final PluginCall call) {
        FirebaseAuth.getInstance().signOut();
        if (googleAuthProviderHandler != null) {
            googleAuthProviderHandler.signOut();
        }
        if (facebookAuthProviderHandler != null) {
            facebookAuthProviderHandler.signOut();
        }
        if (playGamesAuthProviderHandler != null) {
            playGamesAuthProviderHandler.signOut();
        }
        call.resolve();
    }

    public void unlink(final PluginCall call, FirebaseUser user, @NonNull String providerId) {
        user
            .unlink(providerId)
            .addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    AuthResult authResult = task.getResult();
                    JSObject userResult = FirebaseAuthenticationHelper.createUserResult(authResult.getUser());
                    JSObject result = new JSObject();
                    result.put("user", (userResult == null ? JSONObject.NULL : userResult));
                    call.resolve(result);
                } else {
                    Exception exception = task.getException();
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            });
    }

    public void updateEmail(FirebaseUser user, @NonNull String newEmail, @NonNull Runnable callback) {
        user
            .updateEmail(newEmail)
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void verifyBeforeUpdateEmail(
        FirebaseUser user,
        @NonNull String newEmail,
        @NonNull ActionCodeSettings actionCodeSettings,
        @NonNull EmptyResultCallback callback
    ) {
        user
            .verifyBeforeUpdateEmail(newEmail, actionCodeSettings)
            .addOnSuccessListener(unused -> callback.success())
            .addOnFailureListener(exception -> callback.error(exception));
    }

    public void updatePassword(FirebaseUser user, @NonNull String newPassword, @NonNull Runnable callback) {
        user
            .updatePassword(newPassword)
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void updateProfile(FirebaseUser user, String displayName, String photoUrl, @NonNull Runnable callback) {
        UserProfileChangeRequest.Builder profileUpdates = new UserProfileChangeRequest.Builder();

        if (displayName != null) {
            profileUpdates.setDisplayName(displayName);
        }
        if (photoUrl != null) {
            profileUpdates.setPhotoUri(Uri.parse(photoUrl));
        }

        user
            .updateProfile(profileUpdates.build())
            .addOnCompleteListener(task -> {
                callback.run();
            });
    }

    public void useAppLanguage() {
        getFirebaseAuthInstance().useAppLanguage();
    }

    public void useEmulator(@NonNull String host, int port) {
        getFirebaseAuthInstance().useEmulator(host, port);
    }

    public void startActivityForResult(final PluginCall call, Intent intent, String callbackName) {
        plugin.startActivityForResult(call, intent, callbackName);
    }

    public void handlePlayGamesAuthProviderSignInActivityResult(@NonNull final PluginCall call, @NonNull ActivityResult result) {
        playGamesAuthProviderHandler.handleOnActivityResult(call, result, false);
    }

    public void handlePlayGamesAuthProviderLinkActivityResult(@NonNull final PluginCall call, @NonNull ActivityResult result) {
        playGamesAuthProviderHandler.handleOnActivityResult(call, result, true);
    }

    public void handleOnActivityResult(int requestCode, int resultCode, @NonNull Intent data) {
        if (requestCode == FacebookAuthProviderHandler.RC_FACEBOOK_AUTH && facebookAuthProviderHandler != null) {
            facebookAuthProviderHandler.handleOnActivityResult(requestCode, resultCode, data);
        }
    }

    public void signInWithCredential(
        @NonNull SignInOptions options,
        @NonNull AuthCredential credential,
        @NonNull NonEmptyResultCallback callback
    ) {
        boolean skipNativeAuth = options.getSkipNativeAuth();
        if (skipNativeAuth) {
            SignInResult result = new SignInResult(null, credential, null);
            callback.success(result);
            return;
        }
        getFirebaseAuthInstance()
            .signInWithCredential(credential)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    Logger.debug(TAG, "signInWithCredential succeeded.");
                    final AuthResult authResult = task.getResult();
                    SignInResult result = new SignInResult(authResult);
                    callback.success(result);
                } else {
                    Logger.error(TAG, "signInWithCredential failed.", task.getException());
                    callback.error(task.getException());
                }
            });
    }

    public void linkWithCredential(@NonNull AuthCredential credential, @NonNull NonEmptyResultCallback callback) {
        FirebaseUser user = getFirebaseAuthInstance().getCurrentUser();
        if (user == null) {
            callback.error(new Exception(ERROR_NO_USER_SIGNED_IN));
            return;
        }
        user
            .linkWithCredential(credential)
            .addOnCompleteListener(plugin.getActivity(), task -> {
                if (task.isSuccessful()) {
                    Logger.debug(TAG, "linkWithCredential succeeded.");
                    final AuthResult authResult = task.getResult();
                    SignInResult result = new SignInResult(authResult);
                    callback.success(result);
                } else {
                    Logger.error(TAG, "linkWithCredential failed.", task.getException());
                    callback.error(task.getException());
                }
            });
    }

    public void handleSuccessfulSignIn(
        final PluginCall call,
        @Nullable AuthCredential credential,
        @Nullable String idToken,
        @Nullable String nonce,
        @Nullable String accessToken,
        @Nullable String serverAuthCode,
        @Nullable AdditionalUserInfo additionalUserInfo
    ) {
        boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
        if (skipNativeAuth) {
            JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(
                null,
                credential,
                idToken,
                nonce,
                accessToken,
                serverAuthCode,
                additionalUserInfo
            );
            call.resolve(signInResult);
            return;
        }
        if (credential == null) {
            handleSuccessfulSignIn(call);
        } else {
            getFirebaseAuthInstance()
                .signInWithCredential(credential)
                .addOnCompleteListener(plugin.getActivity(), task -> {
                    if (task.isSuccessful()) {
                        final AuthResult authResult = task.getResult();
                        handleSuccessfulSignIn(call, authResult, idToken, nonce, accessToken, serverAuthCode);
                    } else {
                        Exception exception = task.getException();
                        Logger.error(TAG, exception.getMessage(), exception);
                        String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                        call.reject(exception.getMessage(), code);
                    }
                });
        }
    }

    public void handleSuccessfulSignIn(
        final PluginCall call,
        @Nullable AuthResult authResult,
        @Nullable String idToken,
        @Nullable String nonce,
        @Nullable String accessToken
    ) {
        if (authResult == null) {
            handleSuccessfulSignIn(call);
        } else {
            JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(
                authResult.getUser(),
                authResult.getCredential(),
                idToken,
                nonce,
                accessToken,
                authResult.getAdditionalUserInfo()
            );
            call.resolve(signInResult);
        }
    }

    public void handleSuccessfulSignIn(
        final PluginCall call,
        @Nullable AuthResult authResult,
        @Nullable String idToken,
        @Nullable String nonce,
        @Nullable String accessToken,
        @Nullable String serverAuthCode
    ) {
        if (authResult == null) {
            handleSuccessfulSignIn(call);
        } else {
            JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(
                authResult.getUser(),
                authResult.getCredential(),
                idToken,
                nonce,
                accessToken,
                serverAuthCode,
                authResult.getAdditionalUserInfo()
            );
            call.resolve(signInResult);
        }
    }

    public void handleSuccessfulSignIn(@NonNull final PluginCall call) {
        JSObject signInResult = FirebaseAuthenticationHelper.createSignInResult(null, null, null, null, null, null);
        call.resolve(signInResult);
    }

    public void handleFailedSignIn(@NonNull final PluginCall call, @Nullable String message, @Nullable Exception exception) {
        if (message == null && exception != null) {
            message = exception.getMessage();
        }
        Logger.error(TAG, message, exception);
        String code = FirebaseAuthenticationHelper.createErrorCode(exception);
        call.reject(message, code);
    }

    public void handleSuccessfulLink(
        final PluginCall call,
        @Nullable AuthCredential credential,
        @Nullable String idToken,
        @Nullable String nonce,
        @Nullable String accessToken,
        @Nullable String serverAuthCode
    ) {
        FirebaseUser user = getFirebaseAuthInstance().getCurrentUser();
        if (user == null) {
            call.reject(ERROR_NO_USER_SIGNED_IN);
            return;
        }
        if (credential == null) {
            handleSuccessfulLink(call);
        } else {
            user
                .linkWithCredential(credential)
                .addOnCompleteListener(plugin.getActivity(), task -> {
                    if (task.isSuccessful()) {
                        final AuthResult authResult = task.getResult();
                        handleSuccessfulLink(call, authResult, idToken, nonce, accessToken, serverAuthCode);
                    } else {
                        Exception exception = task.getException();
                        Logger.error(TAG, exception.getMessage(), exception);
                        String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                        call.reject(exception.getMessage(), code);
                    }
                });
        }
    }

    public void handleSuccessfulLink(
        final PluginCall call,
        @Nullable AuthResult authResult,
        @Nullable String idToken,
        @Nullable String nonce,
        @Nullable String accessToken,
        @Nullable String serverAuthCode
    ) {
        if (authResult == null) {
            handleSuccessfulLink(call);
        } else {
            JSObject linkResult = FirebaseAuthenticationHelper.createSignInResult(
                authResult.getUser(),
                authResult.getCredential(),
                idToken,
                nonce,
                accessToken,
                serverAuthCode,
                authResult.getAdditionalUserInfo()
            );
            call.resolve(linkResult);
        }
    }

    public void handleSuccessfulLink(final PluginCall call) {
        JSObject linkResult = FirebaseAuthenticationHelper.createSignInResult(null, null, null, null, null, null);
        call.resolve(linkResult);
    }

    public void handleFailedLink(final PluginCall call, @Nullable String message, Exception exception) {
        if (message == null && exception != null) {
            message = exception.getMessage();
        }
        Logger.error(TAG, message, exception);
        String code = FirebaseAuthenticationHelper.createErrorCode(exception);
        call.reject(message, code);
    }

    public void handlePhoneVerificationCompleted(@NonNull final PhoneVerificationCompletedEvent event) {
        plugin.handlePhoneVerificationCompleted(event);
    }

    public void handlePhoneVerificationFailed(Exception exception) {
        plugin.handlePhoneVerificationFailed(exception);
    }

    public void handlePhoneCodeSent(String verificationId) {
        plugin.handlePhoneCodeSent(verificationId);
    }

    public FirebaseAuth getFirebaseAuthInstance() {
        return FirebaseAuth.getInstance();
    }

    public FirebaseAuthenticationPlugin getPlugin() {
        return plugin;
    }

    public FirebaseAuthenticationConfig getConfig() {
        return config;
    }

    private void initAuthProviderHandlers(FirebaseAuthenticationConfig config) {
        List<String> providerList = Arrays.asList(config.getProviders());
        if (providerList.contains(ProviderId.APPLE)) {
            appleAuthProviderHandler = new AppleAuthProviderHandler(this);
        }
        if (providerList.contains(ProviderId.FACEBOOK)) {
            facebookAuthProviderHandler = new FacebookAuthProviderHandler(this);
        }
        if (providerList.contains(ProviderId.GOOGLE)) {
            googleAuthProviderHandler = new GoogleAuthProviderHandler(this);
            googleAuthorizationResultLauncher = getPlugin()
                .getActivity()
                .registerForActivityResult(new ActivityResultContracts.StartIntentSenderForResult(), result ->
                    googleAuthProviderHandler.handleActivityResult(result)
                );
        }
        if (providerList.contains(ProviderId.PHONE)) {
            phoneAuthProviderHandler = new PhoneAuthProviderHandler(this);
        }
        if (providerList.contains(ProviderId.PLAY_GAMES)) {
            playGamesAuthProviderHandler = new PlayGamesAuthProviderHandler(this);
        }
        oAuthProviderHandler = new OAuthProviderHandler(this);
    }
}
