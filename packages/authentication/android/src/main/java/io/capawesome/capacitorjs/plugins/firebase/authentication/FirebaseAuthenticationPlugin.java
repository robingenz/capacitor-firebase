package io.capawesome.capacitorjs.plugins.firebase.authentication;

import android.content.Intent;
import androidx.activity.result.ActivityResult;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.FirebaseUser;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.ConfirmVerificationCodeOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.LinkWithPhoneNumberOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.PhoneVerificationCompletedEvent;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.SignInWithPhoneNumberOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.FetchSignInMethodsForEmailOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.RevokeAccessTokenOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.SendEmailVerificationOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.classes.options.SendPasswordResetEmailOptions;
import io.capawesome.capacitorjs.plugins.firebase.authentication.handlers.FacebookAuthProviderHandler;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.EmptyResultCallback;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.NonEmptyResultCallback;
import io.capawesome.capacitorjs.plugins.firebase.authentication.interfaces.Result;
import org.json.JSONObject;

@CapacitorPlugin(name = "FirebaseAuthentication", requestCodes = { FacebookAuthProviderHandler.RC_FACEBOOK_AUTH })
public class FirebaseAuthenticationPlugin extends Plugin {

    public static final String TAG = "FirebaseAuthentication";
    public static final String ERROR_CODE_PREFIX = "auth";
    public static final String PHONE_VERIFICATION_COMPLETED_EVENT = "phoneVerificationCompleted";
    public static final String PHONE_VERIFICATION_FAILED_EVENT = "phoneVerificationFailed";
    public static final String PHONE_CODE_SENT_EVENT = "phoneCodeSent";
    public static final String ERROR_PROVIDER_ID_MISSING = "providerId must be provided.";
    public static final String ERROR_NO_USER_SIGNED_IN = "No user is signed in.";
    public static final String ERROR_TOKEN_MISSING = "token must be provided.";
    public static final String ERROR_OOB_CODE_MISSING = "oobCode must be provided.";
    public static final String ERROR_TENANT_ID_MISSING = "tenantId must be provided.";
    public static final String ERROR_EMAIL_MISSING = "email must be provided.";
    public static final String ERROR_NEW_EMAIL_MISSING = "newEmail must be provided.";
    public static final String ERROR_EMAIL_LINK_MISSING = "emailLink must be provided.";
    public static final String ERROR_ACTION_CODE_SETTINGS_MISSING = "actionCodeSettings must be provided.";
    public static final String ERROR_PASSWORD_MISSING = "password must be provided.";
    public static final String ERROR_NEW_PASSWORD_MISSING = "newPassword must be provided.";
    public static final String ERROR_PHONE_NUMBER_MISSING = "phoneNumber must be provided.";
    public static final String ERROR_VERIFICATION_ID_MISSING = "verificationId must be provided.";
    public static final String ERROR_VERIFICATION_CODE_MISSING = "verificationCode must be provided.";
    public static final String ERROR_PHONE_RESEND_TOKEN_MISSING =
        "signInWithPhoneNumber must be called once before using the resendCode option.";
    public static final String ERROR_HOST_MISSING = "host must be provided.";
    public static final String ERROR_CUSTOM_TOKEN_SKIP_NATIVE_AUTH =
        "signInWithCustomToken cannot be used in combination with skipNativeAuth.";
    public static final String ERROR_EMAIL_LINK_SKIP_NATIVE_AUTH =
        "linkWithEmailAndPassword and linkWithEmailLink cannot be used in combination with skipNativeAuth.";
    public static final String ERROR_EMAIL_LINK_SIGN_IN_SKIP_NATIVE_AUTH =
        "signInWithEmailLink cannot be used in combination with skipNativeAuth.";
    public static final String ERROR_EMAIL_SIGN_IN_SKIP_NATIVE_AUTH =
        "createUserWithEmailAndPassword and signInWithEmailAndPassword cannot be used in combination with skipNativeAuth.";
    public static final String ERROR_SIGN_IN_ANONYMOUSLY_SKIP_NATIVE_AUTH =
        "signInAnonymously cannot be used in combination with skipNativeAuth.";
    public static final String AUTH_STATE_CHANGE_EVENT = "authStateChange";
    public static final String ID_TOKEN_CHANGE_EVENT = "idTokenChange";

    private FirebaseAuthenticationConfig config;
    private FirebaseAuthentication implementation;

    public void load() {
        config = getFirebaseAuthenticationConfig();
        implementation = new FirebaseAuthentication(this, config);
    }

    @PluginMethod
    public void applyActionCode(PluginCall call) {
        try {
            String oobCode = call.getString("oobCode");
            if (oobCode == null) {
                call.reject(ERROR_OOB_CODE_MISSING);
                return;
            }
            implementation.applyActionCode(oobCode, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void confirmPasswordReset(PluginCall call) {
        try {
            String oobCode = call.getString("oobCode");
            if (oobCode == null) {
                call.reject(ERROR_OOB_CODE_MISSING);
                return;
            }
            String newPassword = call.getString("newPassword");
            if (newPassword == null) {
                call.reject(ERROR_NEW_PASSWORD_MISSING);
                return;
            }
            implementation.confirmPasswordReset(oobCode, newPassword, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void confirmVerificationCode(PluginCall call) {
        try {
            String verificationId = call.getString("verificationId");
            if (verificationId == null) {
                call.reject(ERROR_VERIFICATION_ID_MISSING);
                return;
            }
            String verificationCode = call.getString("verificationCode");
            if (verificationCode == null) {
                call.reject(ERROR_VERIFICATION_CODE_MISSING);
                return;
            }
            ConfirmVerificationCodeOptions options = new ConfirmVerificationCodeOptions(verificationId, verificationCode);
            NonEmptyResultCallback callback = new NonEmptyResultCallback() {
                @Override
                public void success(Result result) {
                    call.resolve(result.toJSObject());
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.confirmVerificationCode(options, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void createUserWithEmailAndPassword(PluginCall call) {
        try {
            implementation.createUserWithEmailAndPassword(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void deleteUser(PluginCall call) {
        try {
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.deleteUser(user, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void fetchSignInMethodsForEmail(PluginCall call) {
        try {
            String email = call.getString("email");
            if (email == null) {
                call.reject(ERROR_EMAIL_MISSING);
                return;
            }

            FetchSignInMethodsForEmailOptions options = new FetchSignInMethodsForEmailOptions(email);
            NonEmptyResultCallback callback = new NonEmptyResultCallback() {
                @Override
                public void success(Result result) {
                    call.resolve(result.toJSObject());
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.fetchSignInMethodsForEmail(options, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        try {
            FirebaseUser user = implementation.getCurrentUser();
            JSObject userResult = FirebaseAuthenticationHelper.createUserResult(user);
            JSObject result = new JSObject();
            result.put("user", (userResult == null ? JSONObject.NULL : userResult));
            call.resolve(result);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void getIdToken(PluginCall call) {
        try {
            Boolean forceRefresh = call.getBoolean("forceRefresh", false);

            NonEmptyResultCallback callback = new NonEmptyResultCallback() {
                @Override
                public void success(Result result) {
                    call.resolve(result.toJSObject());
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.getIdToken(forceRefresh, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void getIdTokenResult(PluginCall call) {
        try {
            Boolean forceRefresh = call.getBoolean("forceRefresh", false);

            NonEmptyResultCallback callback = new NonEmptyResultCallback() {
                @Override
                public void success(Result result) {
                    call.resolve(result.toJSObject());
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.getIdTokenResult(forceRefresh, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void getPendingAuthResult(PluginCall call) {
        try {
            implementation.getPendingAuthResult(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void getRedirectResult(PluginCall call) {
        call.reject("Not available on Android.");
    }

    @PluginMethod
    public void getTenantId(PluginCall call) {
        try {
            String tenantId = implementation.getTenantId();

            JSObject result = new JSObject();
            result.put("tenantId", (tenantId == null ? JSONObject.NULL : tenantId));
            call.resolve(result);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void isSignInWithEmailLink(PluginCall call) {
        try {
            String emailLink = call.getString("emailLink");
            if (emailLink == null) {
                call.reject(ERROR_EMAIL_LINK_MISSING);
                return;
            }
            JSObject result = new JSObject();
            result.put("isSignInWithEmailLink", implementation.isSignInWithEmailLink(emailLink));
            call.resolve(result);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithApple(PluginCall call) {
        try {
            implementation.linkWithApple(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithEmailAndPassword(PluginCall call) {
        try {
            implementation.linkWithEmailAndPassword(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithEmailLink(PluginCall call) {
        try {
            implementation.linkWithEmailLink(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithFacebook(PluginCall call) {
        try {
            implementation.linkWithFacebook(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithGithub(PluginCall call) {
        try {
            implementation.linkWithGithub(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithGoogle(PluginCall call) {
        try {
            implementation.linkWithGoogle(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithMicrosoft(PluginCall call) {
        try {
            implementation.linkWithMicrosoft(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithOpenIdConnect(PluginCall call) {
        try {
            String providerId = call.getString("providerId");
            if (providerId == null) {
                call.reject(ERROR_PROVIDER_ID_MISSING);
                return;
            }

            implementation.linkWithOpenIdConnect(call, providerId);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithPhoneNumber(PluginCall call) {
        try {
            String phoneNumber = call.getString("phoneNumber");
            if (phoneNumber == null) {
                call.reject(ERROR_PHONE_NUMBER_MISSING);
                return;
            }
            boolean resendCode = call.getBoolean("resendCode", false);
            Long timeout = call.getLong("timeout", 60L);
            LinkWithPhoneNumberOptions options = new LinkWithPhoneNumberOptions(phoneNumber, resendCode, timeout);

            implementation.linkWithPhoneNumber(options);
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithPlayGames(PluginCall call) {
        try {
            implementation.linkWithPlayGames(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithTwitter(PluginCall call) {
        try {
            implementation.linkWithTwitter(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void linkWithYahoo(PluginCall call) {
        try {
            implementation.linkWithYahoo(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void reload(PluginCall call) {
        try {
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.reload(user, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void revokeAccessToken(PluginCall call) {
        try {
            String token = call.getString("token");
            if (token == null) {
                call.reject(ERROR_TOKEN_MISSING);
                return;
            }

            RevokeAccessTokenOptions options = new RevokeAccessTokenOptions(token);
            EmptyResultCallback callback = new EmptyResultCallback() {
                @Override
                public void success() {
                    call.resolve();
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.revokeAccessToken(options, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void sendEmailVerification(PluginCall call) {
        try {
            JSObject actionCodeSettings = call.getObject("actionCodeSettings");

            SendEmailVerificationOptions options = new SendEmailVerificationOptions(actionCodeSettings);
            EmptyResultCallback callback = new EmptyResultCallback() {
                @Override
                public void success() {
                    call.resolve();
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.sendEmailVerification(options, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void sendPasswordResetEmail(PluginCall call) {
        try {
            String email = call.getString("email");
            if (email == null) {
                call.reject(ERROR_EMAIL_MISSING);
                return;
            }
            JSObject actionCodeSettings = call.getObject("actionCodeSettings");

            SendPasswordResetEmailOptions options = new SendPasswordResetEmailOptions(email, actionCodeSettings);
            EmptyResultCallback callback = new EmptyResultCallback() {
                @Override
                public void success() {
                    call.resolve();
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.sendPasswordResetEmail(options, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void sendSignInLinkToEmail(PluginCall call) {
        try {
            String email = call.getString("email");
            if (email == null) {
                call.reject(ERROR_EMAIL_MISSING);
                return;
            }
            JSObject settings = call.getObject("actionCodeSettings");
            if (settings == null) {
                call.reject(ERROR_ACTION_CODE_SETTINGS_MISSING);
                return;
            }

            ActionCodeSettings actionCodeSettings = FirebaseAuthenticationHelper.createActionCodeSettings(settings);

            implementation.sendSignInLinkToEmail(email, actionCodeSettings, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void setLanguageCode(PluginCall call) {
        try {
            String languageCode = call.getString("languageCode", "");

            implementation.setLanguageCode(languageCode);
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void setPersistence(PluginCall call) {
        call.reject("Not available on Android.");
    }

    @PluginMethod
    public void setTenantId(PluginCall call) {
        try {
            String tenantId = call.getString("tenantId");
            if (tenantId == null) {
                call.reject(ERROR_TENANT_ID_MISSING);
                return;
            }

            implementation.setTenantId(tenantId);
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInAnonymously(PluginCall call) {
        try {
            implementation.signInAnonymously(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithApple(PluginCall call) {
        try {
            implementation.signInWithApple(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithGameCenter(PluginCall call) {
        call.reject("Not available on Android.");
    }

    @PluginMethod
    public void signInWithCustomToken(PluginCall call) {
        try {
            implementation.signInWithCustomToken(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithEmailAndPassword(PluginCall call) {
        try {
            implementation.signInWithEmailAndPassword(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithEmailLink(PluginCall call) {
        try {
            implementation.signInWithEmailLink(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithFacebook(PluginCall call) {
        try {
            implementation.signInWithFacebook(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithGithub(PluginCall call) {
        try {
            implementation.signInWithGithub(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithGoogle(PluginCall call) {
        try {
            implementation.signInWithGoogle(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithMicrosoft(PluginCall call) {
        try {
            implementation.signInWithMicrosoft(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithOpenIdConnect(PluginCall call) {
        try {
            String providerId = call.getString("providerId");
            if (providerId == null) {
                call.reject(ERROR_PROVIDER_ID_MISSING);
                return;
            }

            implementation.signInWithOpenIdConnect(call, providerId);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithPhoneNumber(PluginCall call) {
        try {
            boolean skipNativeAuth = call.getBoolean("skipNativeAuth", this.config.getSkipNativeAuth());
            String phoneNumber = call.getString("phoneNumber");
            if (phoneNumber == null) {
                call.reject(ERROR_PHONE_NUMBER_MISSING);
                return;
            }
            boolean resendCode = call.getBoolean("resendCode", false);
            Long timeout = call.getLong("timeout", 60L);
            SignInWithPhoneNumberOptions options = new SignInWithPhoneNumberOptions(skipNativeAuth, phoneNumber, resendCode, timeout);

            implementation.signInWithPhoneNumber(options);
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithPlayGames(PluginCall call) {
        try {
            implementation.signInWithPlayGames(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithTwitter(PluginCall call) {
        try {
            implementation.signInWithTwitter(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signInWithYahoo(PluginCall call) {
        try {
            implementation.signInWithYahoo(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void signOut(PluginCall call) {
        try {
            implementation.signOut(call);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void unlink(PluginCall call) {
        try {
            String providerId = call.getString("providerId");
            if (providerId == null) {
                call.reject(ERROR_PROVIDER_ID_MISSING);
                return;
            }
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.unlink(call, user, providerId);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void updateEmail(PluginCall call) {
        try {
            String newEmail = call.getString("newEmail");
            if (newEmail == null) {
                call.reject(ERROR_NEW_EMAIL_MISSING);
                return;
            }
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.updateEmail(user, newEmail, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void verifyBeforeUpdateEmail(PluginCall call) {
        try {
            String newEmail = call.getString("newEmail");
            if (newEmail == null) {
                call.reject(ERROR_NEW_EMAIL_MISSING);
                return;
            }

            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }

            JSObject settings = call.getObject("actionCodeSettings");
            if (settings == null) {
                call.reject(ERROR_ACTION_CODE_SETTINGS_MISSING);
                return;
            }
            ActionCodeSettings actionCodeSettings = FirebaseAuthenticationHelper.createActionCodeSettings(settings);

            EmptyResultCallback callback = new EmptyResultCallback() {
                @Override
                public void success() {
                    call.resolve();
                }

                @Override
                public void error(Exception exception) {
                    Logger.error(TAG, exception.getMessage(), exception);
                    String code = FirebaseAuthenticationHelper.createErrorCode(exception);
                    call.reject(exception.getMessage(), code);
                }
            };

            implementation.verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings, callback);
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void updatePassword(PluginCall call) {
        try {
            String newPassword = call.getString("newPassword");
            if (newPassword == null) {
                call.reject(ERROR_NEW_PASSWORD_MISSING);
                return;
            }
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.updatePassword(user, newPassword, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void updateProfile(PluginCall call) {
        try {
            String displayName = call.getString("displayName");
            String photoUrl = call.getString("photoUrl");
            FirebaseUser user = implementation.getCurrentUser();
            if (user == null) {
                call.reject(ERROR_NO_USER_SIGNED_IN);
                return;
            }
            implementation.updateProfile(user, displayName, photoUrl, () -> call.resolve());
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void useAppLanguage(PluginCall call) {
        try {
            implementation.useAppLanguage();
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    @PluginMethod
    public void useEmulator(PluginCall call) {
        try {
            String host = call.getString("host");
            if (host == null) {
                call.reject(ERROR_HOST_MISSING);
                return;
            }
            int port = call.getInt("port", 9099);

            implementation.useEmulator(host, port);
            call.resolve();
        } catch (Exception exception) {
            Logger.error(TAG, exception.getMessage(), exception);
            String code = FirebaseAuthenticationHelper.createErrorCode(exception);
            call.reject(exception.getMessage(), code);
        }
    }

    public void handlePhoneVerificationCompleted(@NonNull final PhoneVerificationCompletedEvent event) {
        notifyListeners(PHONE_VERIFICATION_COMPLETED_EVENT, event.toJSObject(), true);
    }

    public void handlePhoneVerificationFailed(Exception exception) {
        Logger.error(TAG, exception.getMessage(), exception);
        JSObject result = new JSObject();
        result.put("message", exception.getMessage());
        notifyListeners(PHONE_VERIFICATION_FAILED_EVENT, result, true);
    }

    public void handlePhoneCodeSent(String verificationId) {
        JSObject result = new JSObject();
        result.put("verificationId", verificationId);
        notifyListeners(PHONE_CODE_SENT_EVENT, result, true);
    }

    @Override
    public void startActivityForResult(PluginCall call, Intent intent, String callbackName) {
        super.startActivityForResult(call, intent, callbackName);
    }

    public void handleAuthStateChange() {
        FirebaseUser user = implementation.getCurrentUser();
        JSObject userResult = FirebaseAuthenticationHelper.createUserResult(user);
        JSObject result = new JSObject();
        result.put("user", (userResult == null ? JSONObject.NULL : userResult));
        notifyListeners(AUTH_STATE_CHANGE_EVENT, result, true);
    }

    public void handleIdTokenChange() {
        NonEmptyResultCallback callback = new NonEmptyResultCallback() {
            @Override
            public void success(Result result) {
                notifyListeners(ID_TOKEN_CHANGE_EVENT, result.toJSObject(), true);
            }

            @Override
            public void error(Exception exception) {
                Logger.error(TAG, exception.getMessage(), exception);
            }
        };
        implementation.getIdToken(false, callback);
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        if (data == null) {
            return;
        }
        implementation.handleOnActivityResult(requestCode, resultCode, data);
    }

    @ActivityCallback
    private void handlePlayGamesAuthProviderSignInActivityResult(@Nullable PluginCall call, @Nullable ActivityResult result) {
        if (call == null || result == null) {
            return;
        }
        implementation.handlePlayGamesAuthProviderSignInActivityResult(call, result);
    }

    @ActivityCallback
    private void handlePlayGamesAuthProviderLinkActivityResult(@Nullable PluginCall call, @Nullable ActivityResult result) {
        if (call == null || result == null) {
            return;
        }
        implementation.handlePlayGamesAuthProviderLinkActivityResult(call, result);
    }

    private FirebaseAuthenticationConfig getFirebaseAuthenticationConfig() {
        FirebaseAuthenticationConfig config = new FirebaseAuthenticationConfig();

        boolean skipNativeAuth = getConfig().getBoolean("skipNativeAuth", config.getSkipNativeAuth());
        config.setSkipNativeAuth(skipNativeAuth);
        String[] providers = getConfig().getArray("providers", config.getProviders());
        config.setProviders(providers);

        return config;
    }
}
