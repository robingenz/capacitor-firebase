/// <reference types="@capacitor/cli" />

import type { PluginListenerHandle } from '@capacitor/core';

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    /**
     * These configuration values are available:
     *
     * @since 0.1.0
     */
    FirebaseAuthentication?: {
      /**
       * Configure whether the plugin should skip the native authentication.
       * Only needed if you want to use the Firebase JavaScript SDK.
       * This configuration option has no effect on Firebase account linking.
       *
       * **Note that the plugin may behave differently across the platforms.**
       *
       * Only available for Android and iOS.
       *
       * @default false
       * @example false
       * @since 0.1.0
       */
      skipNativeAuth?: boolean;
      /**
       * Configure the providers that should be loaded by the plugin.
       *
       * Possible values: `["apple.com", "facebook.com", "gc.apple.com", "github.com", "google.com", "microsoft.com", "playgames.google.com", "twitter.com", "yahoo.com", "phone"]`
       *
       * Only available for Android and iOS.
       *
       * @default []
       * @example ["apple.com", "facebook.com"]
       * @since 0.1.0
       */
      providers?: string[];
    };
  }
}

export interface FirebaseAuthenticationPlugin {
  /**
   * Applies a verification code sent to the user by email.
   *
   * @since 0.2.2
   */
  applyActionCode(options: ApplyActionCodeOptions): Promise<void>;
  /**
   * Completes the password reset process.
   *
   * @since 0.2.2
   */
  confirmPasswordReset(options: ConfirmPasswordResetOptions): Promise<void>;
  /**
   * Finishes the phone number verification process.
   *
   * @since 5.0.0
   */
  confirmVerificationCode(
    options: ConfirmVerificationCodeOptions,
  ): Promise<SignInResult>;
  /**
   * Creates a new user account with email and password.
   * If the new account was created, the user is signed in automatically.
   *
   * @since 0.2.2
   */
  createUserWithEmailAndPassword(
    options: CreateUserWithEmailAndPasswordOptions,
  ): Promise<SignInResult>;
  /**
   * Deletes and signs out the user.
   *
   * @since 1.3.0
   */
  deleteUser(): Promise<void>;
  /**
   * Fetches the sign-in methods for an email address.
   *
   * @since 6.0.0
   * @deprecated Migrating off of this method is recommended as a security best-practice.
   * Learn more in the Identity Platform documentation for [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection).
   */
  fetchSignInMethodsForEmail(
    options: FetchSignInMethodsForEmailOptions,
  ): Promise<FetchSignInMethodsForEmailResult>;
  /**
   * Fetches the currently signed-in user.
   *
   * @since 0.1.0
   */
  getCurrentUser(): Promise<GetCurrentUserResult>;
  /**
   * Returns the `SignInResult` if your app launched a web sign-in flow and the OS cleans up the app while in the background.
   *
   * Only available for Android.
   *
   * @since 6.0.0
   */
  getPendingAuthResult(): Promise<SignInResult>;
  /**
   * Fetches the Firebase Auth ID Token for the currently signed-in user.
   *
   * @since 0.1.0
   */
  getIdToken(options?: GetIdTokenOptions): Promise<GetIdTokenResult>;
  /**
   * Returns a deserialized JSON Web Token (JWT) used to identify the user to a Firebase service.
   *
   * @since 6.4.0
   */
  getIdTokenResult(
    options?: GetIdTokenResultOptions,
  ): Promise<GetIdTokenResultResult>;
  /**
   * Returns the `SignInResult` from the redirect-based sign-in flow.
   *
   * If sign-in was unsuccessful, fails with an error.
   * If no redirect operation was called, returns a `SignInResult` with a null user.
   *
   * Only available for Web.
   *
   * @since 1.3.0
   */
  getRedirectResult(): Promise<SignInResult>;
  /**
   * Get the tenant id.
   *
   * @since 1.1.0
   */
  getTenantId(): Promise<GetTenantIdResult>;
  /**
   * Checks if an incoming link is a sign-in with email link suitable for `signInWithEmailLink`.
   *
   * @since 1.1.0
   */
  isSignInWithEmailLink(
    options: IsSignInWithEmailLinkOptions,
  ): Promise<IsSignInWithEmailLinkResult>;
  /**
   * Links the user account with Apple authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithApple(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Email authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithEmailAndPassword(
    options: LinkWithEmailAndPasswordOptions,
  ): Promise<LinkResult>;
  /**
   * Links the user account with Email authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithEmailLink(options: LinkWithEmailLinkOptions): Promise<LinkResult>;
  /**
   * Links the user account with Facebook authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithFacebook(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Game Center authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * Only available for iOS.
   *
   * @since 1.3.0
   */
  linkWithGameCenter(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with GitHub authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithGithub(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Google authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithGoogle(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Microsoft authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithMicrosoft(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with an OpenID Connect provider.
   *
   * @since 6.1.0
   */
  linkWithOpenIdConnect(
    options: LinkWithOpenIdConnectOptions,
  ): Promise<LinkResult>;
  /**
   * Links the user account with Phone Number authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * Use the `phoneVerificationCompleted` listener to be notified when the verification is completed.
   * Use the `phoneVerificationFailed` listener to be notified when the verification is failed.
   * Use the `phoneCodeSent` listener to get the verification id.
   *
   * @since 1.1.0
   */
  linkWithPhoneNumber(options: LinkWithPhoneNumberOptions): Promise<void>;
  /**
   * Links the user account with Play Games authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * Only available for Android.
   *
   * @since 1.1.0
   */
  linkWithPlayGames(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Twitter authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithTwitter(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Links the user account with Yahoo authentication provider.
   *
   * The user must be logged in on the native layer.
   * The `skipNativeAuth` configuration option has no effect here.
   *
   * @since 1.1.0
   */
  linkWithYahoo(options?: LinkWithOAuthOptions): Promise<LinkResult>;
  /**
   * Reloads user account data, if signed in.
   *
   * @since 1.3.0
   */
  reload(): Promise<void>;
  /**
   * Revokes the given access token. Currently only supports Apple OAuth access tokens.
   *
   * @since 6.1.0
   */
  revokeAccessToken(options: RevokeAccessTokenOptions): Promise<void>;
  /**
   * Sends a verification email to the currently signed in user.
   *
   * @since 0.2.2
   */
  sendEmailVerification(options?: SendEmailVerificationOptions): Promise<void>;
  /**
   * Sends a password reset email.
   *
   * @since 0.2.2
   */
  sendPasswordResetEmail(options: SendPasswordResetEmailOptions): Promise<void>;
  /**
   * Sends a sign-in email link to the user with the specified email.
   *
   * To complete sign in with the email link, call `signInWithEmailLink` with the email address and the email link supplied in the email sent to the user.
   *
   * @since 1.1.0
   */
  sendSignInLinkToEmail(options: SendSignInLinkToEmailOptions): Promise<void>;
  /**
   * Sets the user-facing language code for auth operations.
   *
   * @since 0.1.0
   */
  setLanguageCode(options: SetLanguageCodeOptions): Promise<void>;
  /**
   * Sets the type of persistence for the currently saved auth session.
   *
   * Only available for Web.
   *
   * @since 5.2.0
   */
  setPersistence(options: SetPersistenceOptions): Promise<void>;
  /**
   * Sets the tenant id.
   *
   * @since 1.1.0
   */
  setTenantId(options: SetTenantIdOptions): Promise<void>;
  /**
   * Signs in as an anonymous user.
   *
   * @since 1.1.0
   */
  signInAnonymously(): Promise<SignInResult>;
  /**
   * Starts the Apple sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithApple(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Custom Token sign-in flow.
   *
   * This method cannot be used in combination with `skipNativeAuth` on Android and iOS.
   * In this case you have to use the `signInWithCustomToken` interface of the Firebase JS SDK directly.
   *
   * @since 0.1.0
   */
  signInWithCustomToken(
    options: SignInWithCustomTokenOptions,
  ): Promise<SignInResult>;
  /**
   * Starts the sign-in flow using an email and password.
   *
   * @since 0.2.2
   */
  signInWithEmailAndPassword(
    options: SignInWithEmailAndPasswordOptions,
  ): Promise<SignInResult>;
  /**
   * Signs in using an email and sign-in email link.
   *
   * @since 1.1.0
   */
  signInWithEmailLink(
    options: SignInWithEmailLinkOptions,
  ): Promise<SignInResult>;
  /**
   * Starts the Facebook sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithFacebook(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Game Center sign-in flow.
   *
   * Only available for iOS.
   *
   * @since 1.3.0
   */
  signInWithGameCenter(
    options?: SignInOptions | SignInWithOAuthOptions,
  ): Promise<SignInResult>;
  /**
   * Starts the GitHub sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithGithub(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Google sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithGoogle(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Microsoft sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithMicrosoft(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the OpenID Connect sign-in flow.
   *
   * @since 6.1.0
   */
  signInWithOpenIdConnect(
    options: SignInWithOpenIdConnectOptions,
  ): Promise<SignInResult>;
  /**
   * Starts the sign-in flow using a phone number.
   *
   * Use the `phoneVerificationCompleted` listener to be notified when the verification is completed.
   * Use the `phoneVerificationFailed` listener to be notified when the verification is failed.
   * Use the `phoneCodeSent` listener to get the verification id.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  signInWithPhoneNumber(options: SignInWithPhoneNumberOptions): Promise<void>;
  /**
   * Starts the Play Games sign-in flow.
   *
   * Only available for Android.
   *
   * @since 0.1.0
   */
  signInWithPlayGames(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Twitter sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithTwitter(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the Yahoo sign-in flow.
   *
   * @since 0.1.0
   */
  signInWithYahoo(options?: SignInWithOAuthOptions): Promise<SignInResult>;
  /**
   * Starts the sign-out flow.
   *
   * @since 0.1.0
   */
  signOut(): Promise<void>;
  /**
   * Unlinks a provider from a user account.
   *
   * @since 1.1.0
   */
  unlink(options: UnlinkOptions): Promise<UnlinkResult>;
  /**
   * Updates the email address of the currently signed in user.
   *
   * @since 0.1.0
   */
  updateEmail(options: UpdateEmailOptions): Promise<void>;
  /**
   * Updates the password of the currently signed in user.
   *
   * @since 0.1.0
   */
  updatePassword(options: UpdatePasswordOptions): Promise<void>;
  /**
   * Updates a user's profile data.
   *
   * @since 1.3.0
   */
  updateProfile(options: UpdateProfileOptions): Promise<void>;
  /**
   * Sets the user-facing language code to be the default app language.
   *
   * @since 0.1.0
   */
  useAppLanguage(): Promise<void>;
  /**
   * Instrument your app to talk to the Authentication emulator.
   *
   * @since 0.2.0
   */
  useEmulator(options: UseEmulatorOptions): Promise<void>;
  /**
   * Verifies the new email address before updating the email address of the currently signed in user.
   *
   * @since 6.3.0
   */
  verifyBeforeUpdateEmail(
    options: VerifyBeforeUpdateEmailOptions,
  ): Promise<void>;
  /**
   * Listen for the user's sign-in state changes.
   *
   * **Attention:** This listener is not triggered when the `skipNativeAuth` is used. Use the Firebase JavaScript SDK instead.
   *
   * @since 0.1.0
   */
  addListener(
    eventName: 'authStateChange',
    listenerFunc: AuthStateChangeListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen to ID token changes for the currently signed-in user.
   *
   * **Attention:** This listener is not triggered when the `skipNativeAuth` is used. Use the Firebase JavaScript SDK instead.
   *
   * @since 6.3.0
   */
  addListener(
    eventName: 'idTokenChange',
    listenerFunc: IdTokenChangeListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for a completed phone verification.
   *
   * This listener only fires in two situations:
   * 1. **Instant verification**: In some cases the phone number can be instantly
   * verified without needing to send or enter a verification code.
   * 2. **Auto-retrieval**: On some devices Google Play services can automatically
   * detect the incoming verification SMS and perform verification without
   * user action.
   *
   * Only available for Android.
   *
   * @since 1.3.0
   */
  addListener(
    eventName: 'phoneVerificationCompleted',
    listenerFunc: PhoneVerificationCompletedListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for a failed phone verification.
   *
   * @since 1.3.0
   */
  addListener(
    eventName: 'phoneVerificationFailed',
    listenerFunc: PhoneVerificationFailedListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Listen for a phone verification code.
   *
   * @since 1.3.0
   */
  addListener(
    eventName: 'phoneCodeSent',
    listenerFunc: PhoneCodeSentListener,
  ): Promise<PluginListenerHandle>;
  /**
   * Remove all listeners for this plugin.
   *
   * @since 0.1.0
   */
  removeAllListeners(): Promise<void>;
}

/**
 * @since 0.2.2
 */
export interface ApplyActionCodeOptions {
  /**
   * A verification code sent to the user.
   *
   * @since 0.2.2
   */
  oobCode: string;
}

/**
 * @since 0.2.2
 */
export interface ConfirmPasswordResetOptions {
  /**
   * A verification code sent to the user.
   *
   * @since 0.2.2
   */
  oobCode: string;
  /**
   * The new password.
   *
   * @since 0.2.2
   */
  newPassword: string;
}

/**
 * @since 5.0.0
 */
export interface ConfirmVerificationCodeOptions {
  /**
   * The verification ID received from the `phoneCodeSent` listener.
   *
   * The `verificationCode` option must also be provided.
   *
   * @since 5.0.0
   */
  verificationId: string;
  /**
   * The verification code either received from the `phoneCodeSent` listener or entered by the user.
   *
   * The `verificationId` option must also be provided.
   *
   * @since 5.0.0
   */
  verificationCode: string;
}

/**
 * @since 0.2.2
 */
export interface CreateUserWithEmailAndPasswordOptions {
  /**
   * @since 0.2.2
   */
  email: string;
  /**
   * @since 0.2.2
   */
  password: string;
}

/**
 * @since 6.0.0
 */
export interface FetchSignInMethodsForEmailOptions {
  /**
   * The user's email address.
   *
   * @since 6.0.0
   */
  email: string;
}

/**
 * @since 6.0.0
 */
export interface FetchSignInMethodsForEmailResult {
  /**
   * The sign-in methods for the specified email address.
   *
   * This list is empty when [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection)
   * is enabled, irrespective of the number of authentication methods available for the given email.
   *
   * @since 6.0.0
   */
  signInMethods: string[];
}

/**
 * @since 0.1.0
 */
export interface GetCurrentUserResult {
  /**
   * The currently signed-in user, or null if there isn't any.
   *
   * @since 0.1.0
   */
  user: User | null;
}

/**
 * @since 0.1.0
 */
export interface GetIdTokenOptions {
  /**
   * Force refresh regardless of token expiration.
   *
   * @since 0.1.0
   */
  forceRefresh: boolean;
}

/**
 * @since 6.4.0
 */
export interface GetIdTokenResultOptions {
  /**
   * Force refresh regardless of token expiration.
   *
   * @since 6.4.0
   */
  forceRefresh: boolean;
}

/**
 * @since 0.1.0
 */
export interface GetIdTokenResult {
  /**
   * The Firebase Auth ID token JWT string.
   *
   * @since 0.1.0
   */
  token: string;
}

export interface GetIdTokenResultResult {
  /**
   * The authentication time formatted as a UTC string.
   *
   * This is the time the user authenticated (signed in) and not the time the token was refreshed.
   *
   * @since 6.4.0
   */
  authTime: string;
  /**
   * The ID token expiration time formatted as a UTC string.
   *
   * @since 6.4.0
   */
  expirationTime: string;
  /**
   * The ID token issuance time formatted as a UTC string.
   *
   * @since 6.4.0
   */
  issuedAtTime: string;
  /**
   * The sign-in provider through which the ID token was obtained.
   *
   * @since 6.4.0
   */
  signInProvider: string | null;
  /**
   * The type of second factor associated with this session, provided the user was multi-factor
   * authenticated (eg. phone, etc).
   *
   * @since 6.4.0
   */
  signInSecondFactor: string | null;
  /**
   * The entire payload claims of the ID token including the standard reserved claims as well as
   * the custom claims.
   *
   * @since 6.4.0
   */
  claims: Record<string, unknown>;
}

/**
 * @since 1.1.0
 */
export interface GetTenantIdResult {
  /**
   * The tenant id.
   * `null` if it has never been set.
   *
   * @since 1.1.0
   */
  tenantId: string | null;
}

/**
 * @since 6.1.0
 */
export interface RevokeAccessTokenOptions {
  /**
   * The access token to revoke.
   *
   * @since 6.1.0
   */
  token: string;
}

/**
 * @since 6.1.0
 */
export interface SendEmailVerificationOptions {
  /**
   * Structure that contains the required continue/state URL with optional Android and iOS bundle identifiers.
   *
   * @since 6.1.0
   */
  actionCodeSettings?: ActionCodeSettings;
}

/**
 * @since 0.2.2
 */
export interface SendPasswordResetEmailOptions {
  /**
   * @since 0.2.2
   */
  email: string;
  /**
   * Structure that contains the required continue/state URL with optional Android and iOS bundle identifiers.
   *
   * @since 6.1.0
   */
  actionCodeSettings?: ActionCodeSettings;
}

/**
 * @since 0.1.0
 */
export interface SetLanguageCodeOptions {
  /**
   * BCP 47 language code.
   *
   * @example "en-US"
   * @since 0.1.0
   */
  languageCode: string;
}

/**
 * @since 5.2.0
 */
export interface SetPersistenceOptions {
  /**
   * The persistence types.
   *
   * @since 5.2.0
   */
  persistence: Persistence;
}

/**
 * @since 5.2.0
 */
export enum Persistence {
  /**
   * Long term persistence using IndexedDB.
   *
   * @since 5.2.0
   */
  IndexedDbLocal = 'INDEXED_DB_LOCAL',
  /**
   * No persistence.
   *
   * @since 5.2.0
   */
  InMemory = 'IN_MEMORY',
  /**
   * Long term persistence using local storage.
   *
   * @since 5.2.0
   */
  BrowserLocal = 'BROWSER_LOCAL',
  /**
   * Temporary persistence using session storage.
   *
   * @since 5.2.0
   */
  BrowserSession = 'BROWSER_SESSION',
}

/**
 * @since 1.1.0
 */
export interface SetTenantIdOptions {
  /**
   * The tenant id.
   *
   * @since 1.1.0
   */
  tenantId: string;
}

/**
 * @since 0.2.2
 */
export interface UpdateEmailOptions {
  /**
   * The new email address.
   *
   * @since 0.2.2
   */
  newEmail: string;
}

/**
 * @since 6.3.0
 */
export interface VerifyBeforeUpdateEmailOptions {
  /**
   * The new email address to be verified before update.
   *
   * @since 6.3.0
   */
  newEmail: string;
  /**
   * The action code settings
   *
   * @since 6.3.0
   */
  actionCodeSettings: ActionCodeSettings;
}

/**
 * @since 0.2.2
 */
export interface UpdatePasswordOptions {
  /**
   * The new password.
   *
   * @since 0.2.2
   */
  newPassword: string;
}

/**
 * @since 1.3.0
 */
export interface UpdateProfileOptions {
  /**
   * The user's display name.
   *
   * @since 1.3.0
   */
  displayName?: string | null;
  /**
   * The user's photo URL.
   *
   * @since 1.3.0
   */
  photoUrl?: string | null;
}

/**
 * @since 1.1.0
 */
export type LinkOptions = SignInOptions;

/**
 * @since 1.1.0
 */
export type LinkWithOAuthOptions = SignInWithOAuthOptions;

/**
 * @since 1.1.0
 */
export interface LinkWithEmailAndPasswordOptions {
  /**
   * The user's email address.
   *
   * @since 1.1.0
   */
  email: string;
  /**
   * The user's password.
   *
   * @since 1.1.0
   */
  password: string;
}

/**
 * @since 1.1.0
 */
export interface LinkWithEmailLinkOptions {
  /**
   * The user's email address.
   *
   * @since 1.1.0
   */
  email: string;
  /**
   * The link sent to the user's email address.
   *
   * @since 1.1.0
   */
  emailLink: string;
}

/**
 * @since 6.1.0
 */
export type LinkWithOpenIdConnectOptions = SignInWithOpenIdConnectOptions;

/**
 * @since 1.1.0
 */
export type LinkWithPhoneNumberOptions = SignInWithPhoneNumberOptions;

/**
 * @since 1.1.0
 */
export type LinkWithCustomTokenOptions = SignInWithCustomTokenOptions;

/**
 * @since 1.1.0
 */
export type LinkResult = SignInResult;

/**
 * @since 0.1.0
 */
export interface SignInOptions {
  /**
   * Whether the plugin should skip the native authentication or not.
   * Only needed if you want to use the Firebase JavaScript SDK.
   * This value overwrites the configrations value of the `skipNativeAuth` option.
   * If no value is set, the configuration value is used.
   *
   * **Note that the plugin may behave differently across the platforms.**
   *
   * `skipNativeAuth` cannot be used in combination with `signInWithCustomToken`, `createUserWithEmailAndPassword` or `signInWithEmailAndPassword`.
   *
   * Only available for Android and iOS.
   *
   * @since 1.1.0
   */
  skipNativeAuth?: boolean;
}

/**
 * @since 1.1.0
 */
export interface SignInWithOAuthOptions extends SignInOptions {
  /**
   * Configures custom parameters to be passed to the identity provider during the OAuth sign-in flow.
   *
   * Supports Apple, Facebook, GitHub, Google, Microsoft, Twitter and Yahoo on Web.
   * Supports Apple, GitHub, Microsoft, Twitter and Yahoo on Android.
   * Supports Facebook, GitHub, Microsoft, Twitter and Yahoo on iOS.
   *
   * @since 1.1.0
   */
  customParameters?: SignInCustomParameter[];
  /**
   * Whether to use the popup-based OAuth authentication flow or the full-page redirect flow.
   * If you choose `redirect`, you will get the result of the call via the `authStateChange` listener after the redirect.
   *
   * Only available for Web.
   *
   * @default 'popup'
   * @since 1.3.0
   */
  mode?: 'popup' | 'redirect';
  /**
   * Scopes to request from provider.
   *
   * Supports Apple, Facebook, GitHub, Google, Microsoft, Twitter and Yahoo on Web.
   * Supports Apple, GitHub, Google, Microsoft, Twitter, Yahoo and Play Games on Android.
   * Supports Facebook, GitHub, Google, Microsoft, Twitter and Yahoo on iOS.
   *
   * @since 1.1.0
   */
  scopes?: string[];
}

/**
 * @since 0.1.0
 */
export interface SignInCustomParameter {
  /**
   * The custom parameter key (e.g. `login_hint`).
   *
   * @since 0.1.0
   */
  key: string;
  /**
   * The custom parameter value (e.g. `user@firstadd.onmicrosoft.com`).
   *
   * @since 0.1.0
   */
  value: string;
}

/**
 * @since 6.1.0
 */
export interface SignInWithOpenIdConnectOptions extends SignInWithOAuthOptions {
  /**
   * The OpenID Connect provider ID.
   *
   * @since 6.1.0
   * @example oidc.example-provider
   */
  providerId: string;
}

/**
 * @since 0.1.0
 */
export interface SignInWithPhoneNumberOptions extends SignInOptions {
  /**
   * The phone number to be verified in E.164 format.
   *
   * @example "+16505550101"
   * @since 0.1.0
   */
  phoneNumber: string;
  /**
   * The reCAPTCHA verifier.
   * Must be an instance of `firebase.auth.RecaptchaVerifier`.
   *
   * Only available for Web.
   *
   * @since 5.2.0
   */
  recaptchaVerifier?: unknown;
  /**
   * Resend the verification code to the specified phone number.
   * `signInWithPhoneNumber` must be called once before using this option.
   *
   * Only available for Android.
   *
   * @since 1.3.0
   * @default false
   */
  resendCode?: boolean;
  /**
   * The maximum amount of time in seconds to wait for the SMS auto-retrieval.
   *
   * Use 0 to disable SMS-auto-retrieval.
   *
   * Only available for Android.
   *
   * @since 5.4.0
   * @default 60
   * @see https://firebase.google.com/docs/reference/android/com/google/firebase/auth/PhoneAuthOptions.Builder#setTimeout(java.lang.Long,java.util.concurrent.TimeUnit)
   */
  timeout?: number;
}

/**
 * @since 0.2.2
 */
export interface SignInWithEmailAndPasswordOptions extends SignInOptions {
  /**
   * The user's email address.
   *
   * @since 0.2.2
   */
  email: string;
  /**
   * The user's password.
   *
   * @since 0.2.2
   */
  password: string;
}

/**
 * @since 1.1.0
 */
export interface SendSignInLinkToEmailOptions {
  /**
   * The user's email address.
   *
   * @since 1.1.0
   */
  email: string;
  /**
   * Structure that contains the required continue/state URL with optional Android and iOS bundle identifiers.
   *
   * @since 1.1.0
   */
  actionCodeSettings: ActionCodeSettings;
}

/**
 * @since 1.1.0
 */
export interface IsSignInWithEmailLinkOptions {
  /**
   * The link sent to the user's email address.
   *
   * @since 1.1.0
   */
  emailLink: string;
}
/**
 * @since 1.1.0
 */
export interface IsSignInWithEmailLinkResult {
  /**
   * Whether an incoming link is a signup with email link suitable for `signInWithEmailLink(...)`.
   */
  isSignInWithEmailLink: boolean;
}

/**
 * @since 1.1.0
 */
export interface SignInWithEmailLinkOptions extends SignInOptions {
  /**
   * The user's email address.
   *
   * @since 1.1.0
   */
  email: string;
  /**
   * The link sent to the user's email address.
   *
   * @since 1.1.0
   */
  emailLink: string;
}

/**
 * @since 0.1.0
 */
export interface SignInWithCustomTokenOptions extends SignInOptions {
  /**
   * The custom token to sign in with.
   *
   * @since 0.1.0
   */
  token: string;
}

/**
 * @since 0.1.0
 */
export interface SignInResult {
  /**
   * The currently signed-in user, or null if there isn't any.
   *
   * @since 0.1.0
   */
  user: User | null;
  /**
   * Credentials returned by an auth provider.
   *
   * @since 0.1.0
   */
  credential: AuthCredential | null;
  /**
   * Additional user information from a federated identity provider.
   *
   * @since 0.5.1
   */
  additionalUserInfo: AdditionalUserInfo | null;
}

/**
 * @since 1.1.0
 */
export interface UnlinkOptions {
  /**
   * The provider to unlink.
   *
   * @since 1.1.0
   */
  providerId: ProviderId;
}

/**
 * @since 1.1.0
 */
export interface UnlinkResult {
  /**
   * The currently signed-in user, or null if there isn't any.
   *
   * @since 1.1.0
   */
  user: User | null;
}

/**
 * @since 0.2.0
 */
export interface UseEmulatorOptions {
  /**
   * The emulator host without any port or scheme.
   *
   * @since 0.2.0
   * @example "127.0.0.1"
   */
  host: string;
  /**
   * The emulator port.
   *
   * @since 0.2.0
   * @default 9099
   * @example 9099
   */
  port?: number;
  /**
   * The emulator scheme.
   *
   * Only available for Web.
   *
   * @since 5.2.0
   * @default "http"
   * @example "https"
   */
  scheme?: string;
}

/**
 * @since 0.1.0
 * @see https://firebase.google.com/docs/reference/js/auth.user
 */
export interface User {
  /**
   * @since 0.1.0
   */
  displayName: string | null;
  /**
   * @since 0.1.0
   */
  email: string | null;
  /**
   * @since 0.1.0
   */
  emailVerified: boolean;
  /**
   * @since 0.1.0
   */
  isAnonymous: boolean;
  /**
   * The user's metadata.
   *
   * @since 5.2.0
   */
  metadata: UserMetadata;
  /**
   * @since 0.1.0
   */
  phoneNumber: string | null;
  /**
   * @since 0.1.0
   */
  photoUrl: string | null;
  /**
   * Additional per provider such as displayName and profile information.
   *
   * @since 5.2.0
   */
  providerData: UserInfo[];
  /**
   * @since 0.1.0
   */
  providerId: string;
  /**
   * @since 0.1.0
   */
  tenantId: string | null;
  /**
   * @since 0.1.0
   */
  uid: string;
}

/**
 * @since 5.2.0
 * @see https://firebase.google.com/docs/reference/js/auth.userinfo
 */
export interface UserInfo {
  /**
   * The display name of the user.
   *
   * @since 5.2.0
   */
  displayName: string | null;
  /**
   * The email of the user.
   *
   * @since 5.2.0
   */
  email: string | null;
  /**
   * The phone number normalized based on the E.164 standard (e.g. +16505550101) for the user.
   *
   * @since 5.2.0
   */
  phoneNumber: string | null;
  /**
   * The profile photo URL of the user.
   *
   * @since 5.2.0
   */
  photoUrl: string | null;
  /**
   * The provider used to authenticate the user.
   *
   * @since 5.2.0
   */
  providerId: string;
  /**
   * The user's unique ID.
   *
   * @since 5.2.0
   */
  uid: string;
}

/**
 * @since 5.2.0
 * @see https://firebase.google.com/docs/reference/js/auth.usermetadata
 */
export interface UserMetadata {
  /**
   * Time the user was created in milliseconds since the epoch.
   *
   * @since 5.2.0
   * @example 1695130859034
   */
  creationTime?: number;
  /**
   * Time the user last signed in in milliseconds since the epoch.
   *
   * @since 5.2.0
   * @example 1695130859034
   */
  lastSignInTime?: number;
}

/**
 * @since 0.1.0
 */
export interface AuthCredential {
  /**
   * The OAuth access token associated with the credential if it belongs to an OAuth provider.
   *
   * @since 0.1.0
   */
  accessToken?: string;
  /**
   * A token that the app uses to interact with the server.
   *
   * Only available for Apple Sign-in on iOS.
   *
   * @since 1.2.0
   */
  authorizationCode?: string;
  /**
   * The OAuth ID token associated with the credential if it belongs to an OIDC provider.
   *
   * @since 0.1.0
   */
  idToken?: string;
  /**
   * The random string used to make sure that the ID token you get was granted specifically in response to your app's authentication request.
   *
   * @since 0.1.0
   */
  nonce?: string;
  /**
   * The authentication provider ID for the credential.
   *
   * @example "google.com"
   * @since 0.1.0
   */
  providerId: string;
  /**
   * The OAuth access token secret associated with the credential if it belongs to an OAuth 1.0 provider.
   *
   * @since 0.1.0
   */
  secret?: string;
  /**
   * The server auth code.
   *
   * Only available for Google Sign-in and Play Games Sign-In on Android and iOS.
   *
   * @since 5.2.0
   */
  serverAuthCode?: string;
}

/**
 * @since 0.5.1
 */
export interface AdditionalUserInfo {
  /**
   * Whether the user is new (sign-up) or existing (sign-in).
   *
   * @since 0.5.1
   */
  isNewUser: boolean;
  /**
   * Map containing IDP-specific user data.
   *
   * @since 0.5.1
   */
  profile?: { [key: string]: unknown };
  /**
   * Identifier for the provider used to authenticate this user.
   *
   * @since 0.5.1
   */
  providerId?: string;
  /**
   * The username if the provider is GitHub or Twitter.
   *
   * @since 0.5.1
   */
  username?: string;
}

/**
 * Callback to receive the user's sign-in state change notifications.
 *
 * @since 0.1.0
 */
export type AuthStateChangeListener = (change: AuthStateChange) => void;

/**
 * Callback to receive the ID token change notifications.
 *
 * @since 6.3.0
 */
export type IdTokenChangeListener = (change: GetIdTokenResult) => void;

/**
 * @since 0.1.0
 */
export interface AuthStateChange {
  /**
   * The currently signed-in user, or null if there isn't any.
   *
   * @since 0.1.0
   */
  user: User | null;
}

/**
 * Callback to receive the verification code sent to the user's phone number.
 *
 * @since 1.3.0
 */
export type PhoneVerificationCompletedListener = (
  event: PhoneVerificationCompletedEvent,
) => void;

/**
 * @since 5.0.0
 */
export interface PhoneVerificationCompletedEvent extends SignInResult {
  /**
   * The verification code sent to the user's phone number.
   *
   * If instant verification is used, this property is not set.
   *
   * @since 5.0.0
   */
  verificationCode?: string;
}

/**
 * Callback to receive notifications of failed phone verification.
 *
 * @since 1.3.0
 */
export type PhoneVerificationFailedListener = (
  event: PhoneVerificationFailedEvent,
) => void;

/**
 * @since 5.0.0
 */
export interface PhoneVerificationFailedEvent {
  /**
   * The error message.
   *
   * @since 1.3.0
   */
  message: string;
}

/**
 * Callback to receive the verification ID.
 *
 * @since 1.3.0
 */
export type PhoneCodeSentListener = (event: PhoneCodeSentEvent) => void;

/**
 * @since 5.0.0
 */
export interface PhoneCodeSentEvent {
  /**
   * The verification ID, which is needed to identify the verification code.
   *
   * @since 1.3.0
   */
  verificationId: string;
}

/**
 * An interface that defines the required continue/state URL with optional Android and iOS
 * bundle identifiers.
 *
 * @since 1.1.0
 */
export interface ActionCodeSettings {
  /**
   * Sets the Android package name.
   */
  android?: {
    installApp?: boolean;
    minimumVersion?: string;
    packageName: string;
  };
  /**
   * When set to true, the action code link will be be sent as a Universal Link or Android App
   * Link and will be opened by the app if installed.
   */
  handleCodeInApp?: boolean;
  /**
   * Sets the iOS bundle ID.
   */
  iOS?: {
    bundleId: string;
  };
  /**
   * Sets the link continue/state URL.
   */
  url: string;
  /**
   * When multiple custom dynamic link domains are defined for a project, specify which one to use
   * when the link is to be opened via a specified mobile app (for example, `example.page.link`).
   */
  dynamicLinkDomain?: string;
}

export enum ProviderId {
  APPLE = 'apple.com',
  FACEBOOK = 'facebook.com',
  GAME_CENTER = 'gc.apple.com',
  GITHUB = 'github.com',
  GOOGLE = 'google.com',
  MICROSOFT = 'microsoft.com',
  PLAY_GAMES = 'playgames.google.com',
  TWITTER = 'twitter.com',
  YAHOO = 'yahoo.com',
  PASSWORD = 'password',
  PHONE = 'phone',
}
