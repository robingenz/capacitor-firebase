import { WebPlugin } from '@capacitor/core';
import type {
  ConfirmationResult,
  AuthCredential as FirebaseAuthCredential,
  AuthProvider as FirebaseAuthProvider,
  CustomParameters as FirebaseCustomParameters,
  User as FirebaseUser,
  UserCredential as FirebaseUserCredential,
  UserInfo as FirebaseUserInfo,
  UserMetadata as FirebaseUserMeatdata,
} from 'firebase/auth';
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  RecaptchaVerifier,
  TwitterAuthProvider,
  applyActionCode,
  browserLocalPersistence,
  browserSessionPersistence,
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getAuth,
  getRedirectResult,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  reload,
  revokeAccessToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  unlink,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';

import type {
  AdditionalUserInfo,
  ApplyActionCodeOptions,
  AuthCredential,
  AuthStateChange,
  ConfirmPasswordResetOptions,
  ConfirmVerificationCodeOptions,
  CreateUserWithEmailAndPasswordOptions,
  FetchSignInMethodsForEmailOptions,
  FetchSignInMethodsForEmailResult,
  FirebaseAuthenticationPlugin,
  GetCurrentUserResult,
  GetIdTokenResultResult,
  GetIdTokenOptions,
  GetIdTokenResult,
  GetTenantIdResult,
  IsSignInWithEmailLinkOptions,
  IsSignInWithEmailLinkResult,
  LinkResult,
  LinkWithEmailAndPasswordOptions,
  LinkWithEmailLinkOptions,
  LinkWithOAuthOptions,
  LinkWithPhoneNumberOptions,
  PhoneCodeSentEvent,
  PhoneVerificationFailedEvent,
  RevokeAccessTokenOptions,
  SendEmailVerificationOptions,
  SendPasswordResetEmailOptions,
  SendSignInLinkToEmailOptions,
  SetLanguageCodeOptions,
  SetPersistenceOptions,
  SetTenantIdOptions,
  SignInResult,
  SignInWithCustomTokenOptions,
  SignInWithEmailAndPasswordOptions,
  SignInWithEmailLinkOptions,
  SignInWithOAuthOptions,
  SignInWithOpenIdConnectOptions,
  SignInWithPhoneNumberOptions,
  UnlinkOptions,
  UnlinkResult,
  UpdateEmailOptions,
  UpdatePasswordOptions,
  UpdateProfileOptions,
  UseEmulatorOptions,
  User,
  UserInfo,
  UserMetadata,
  VerifyBeforeUpdateEmailOptions,
} from './definitions';
import { Persistence, ProviderId } from './definitions';

export class FirebaseAuthenticationWeb
  extends WebPlugin
  implements FirebaseAuthenticationPlugin
{
  public static readonly AUTH_STATE_CHANGE_EVENT = 'authStateChange';
  public static readonly ID_TOKEN_CHANGE_EVENT = 'idTokenChange';
  public static readonly PHONE_CODE_SENT_EVENT = 'phoneCodeSent';
  public static readonly PHONE_VERIFICATION_FAILED_EVENT =
    'phoneVerificationFailed';
  public static readonly ERROR_NO_USER_SIGNED_IN = 'No user is signed in.';
  public static readonly ERROR_PHONE_NUMBER_MISSING =
    'phoneNumber must be provided.';
  public static readonly ERROR_RECAPTCHA_VERIFIER_MISSING =
    'recaptchaVerifier must be provided and must be an instance of RecaptchaVerifier.';
  public static readonly ERROR_CONFIRMATION_RESULT_MISSING =
    'No confirmation result with this verification id was found.';

  private lastConfirmationResult: Map<string, ConfirmationResult> = new Map();

  constructor() {
    super();
    const auth = getAuth();
    auth.onAuthStateChanged(user => this.handleAuthStateChange(user));
    auth.onIdTokenChanged(user => void this.handleIdTokenChange(user));
  }

  public async applyActionCode(options: ApplyActionCodeOptions): Promise<void> {
    const auth = getAuth();
    return applyActionCode(auth, options.oobCode);
  }

  public async createUserWithEmailAndPassword(
    options: CreateUserWithEmailAndPasswordOptions,
  ): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      options.email,
      options.password,
    );
    return this.createSignInResult(userCredential, null);
  }

  public async confirmPasswordReset(
    options: ConfirmPasswordResetOptions,
  ): Promise<void> {
    const auth = getAuth();
    return confirmPasswordReset(auth, options.oobCode, options.newPassword);
  }

  public async confirmVerificationCode(
    options: ConfirmVerificationCodeOptions,
  ): Promise<SignInResult> {
    const { verificationCode, verificationId } = options;
    const confirmationResult = this.lastConfirmationResult.get(verificationId);
    if (!confirmationResult) {
      throw new Error(
        FirebaseAuthenticationWeb.ERROR_CONFIRMATION_RESULT_MISSING,
      );
    }
    const userCredential = await confirmationResult.confirm(verificationCode);
    return this.createSignInResult(userCredential, null);
  }

  public async deleteUser(): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return deleteUser(currentUser);
  }

  public async fetchSignInMethodsForEmail(
    options: FetchSignInMethodsForEmailOptions,
  ): Promise<FetchSignInMethodsForEmailResult> {
    const auth = getAuth();
    const signInMethods = await fetchSignInMethodsForEmail(auth, options.email);
    return {
      signInMethods,
    };
  }

  public async getPendingAuthResult(): Promise<SignInResult> {
    this.throwNotAvailableError();
  }

  public async getCurrentUser(): Promise<GetCurrentUserResult> {
    const auth = getAuth();
    const userResult = this.createUserResult(auth.currentUser);
    const result: GetCurrentUserResult = {
      user: userResult,
    };
    return result;
  }

  public async getIdToken(
    options?: GetIdTokenOptions,
  ): Promise<GetIdTokenResult> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    const idToken = await auth.currentUser.getIdToken(options?.forceRefresh);
    const result: GetIdTokenResult = {
      token: idToken || '',
    };
    return result;
  }

  public async getIdTokenResult(
    options?: GetIdTokenOptions,
  ): Promise<GetIdTokenResultResult> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    const result: GetIdTokenResultResult =
      await auth.currentUser.getIdTokenResult(options?.forceRefresh);
    return result;
  }

  public async getRedirectResult(): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await getRedirectResult(auth);
    const authCredential = userCredential
      ? OAuthProvider.credentialFromResult(userCredential)
      : null;
    return this.createSignInResult(userCredential, authCredential);
  }

  public async getTenantId(): Promise<GetTenantIdResult> {
    const auth = getAuth();
    return {
      tenantId: auth.tenantId,
    };
  }

  public async isSignInWithEmailLink(
    options: IsSignInWithEmailLinkOptions,
  ): Promise<IsSignInWithEmailLinkResult> {
    const auth = getAuth();
    return {
      isSignInWithEmailLink: isSignInWithEmailLink(auth, options.emailLink),
    };
  }

  public async linkWithApple(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new OAuthProvider(ProviderId.APPLE);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithEmailAndPassword(
    options: LinkWithEmailAndPasswordOptions,
  ): Promise<LinkResult> {
    const authCredential = EmailAuthProvider.credential(
      options.email,
      options.password,
    );
    const userCredential =
      await this.linkCurrentUserWithCredential(authCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithEmailLink(
    options: LinkWithEmailLinkOptions,
  ): Promise<LinkResult> {
    const authCredential = EmailAuthProvider.credentialWithLink(
      options.email,
      options.emailLink,
    );
    const userCredential =
      await this.linkCurrentUserWithCredential(authCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithFacebook(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new FacebookAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      FacebookAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithGameCenter(): Promise<LinkResult> {
    this.throwNotAvailableError();
  }

  public async linkWithGithub(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new GithubAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      GithubAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithGoogle(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new GoogleAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      GoogleAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithMicrosoft(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new OAuthProvider(ProviderId.MICROSOFT);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithOpenIdConnect(
    options: SignInWithOpenIdConnectOptions,
  ): Promise<SignInResult> {
    const provider = new OAuthProvider(options.providerId);
    this.applySignInOptions(options, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithPhoneNumber(
    options: LinkWithPhoneNumberOptions,
  ): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    if (!options.phoneNumber) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_PHONE_NUMBER_MISSING);
    }
    if (
      !options.recaptchaVerifier ||
      !(options.recaptchaVerifier instanceof RecaptchaVerifier)
    ) {
      throw new Error(
        FirebaseAuthenticationWeb.ERROR_RECAPTCHA_VERIFIER_MISSING,
      );
    }
    try {
      const confirmationResult = await linkWithPhoneNumber(
        currentUser,
        options.phoneNumber,
        options.recaptchaVerifier,
      );
      const { verificationId } = confirmationResult;
      this.lastConfirmationResult.set(verificationId, confirmationResult);
      const event: PhoneCodeSentEvent = {
        verificationId,
      };
      this.notifyListeners(
        FirebaseAuthenticationWeb.PHONE_CODE_SENT_EVENT,
        event,
      );
    } catch (error) {
      const event: PhoneVerificationFailedEvent = {
        message: this.getErrorMessage(error),
      };
      this.notifyListeners(
        FirebaseAuthenticationWeb.PHONE_VERIFICATION_FAILED_EVENT,
        event,
      );
    }
  }

  public async linkWithPlayGames(): Promise<LinkResult> {
    this.throwNotAvailableError();
  }

  public async linkWithTwitter(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new TwitterAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      TwitterAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async linkWithYahoo(
    options?: LinkWithOAuthOptions,
  ): Promise<LinkResult> {
    const provider = new OAuthProvider(ProviderId.YAHOO);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.linkCurrentUserWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async reload(): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return reload(currentUser);
  }

  public async revokeAccessToken(
    options: RevokeAccessTokenOptions,
  ): Promise<void> {
    const auth = getAuth();
    return revokeAccessToken(auth, options.token);
  }

  public async sendEmailVerification(
    options: SendEmailVerificationOptions,
  ): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return sendEmailVerification(currentUser, options?.actionCodeSettings);
  }

  public async sendPasswordResetEmail(
    options: SendPasswordResetEmailOptions,
  ): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(
      auth,
      options.email,
      options.actionCodeSettings,
    );
  }

  public async sendSignInLinkToEmail(
    options: SendSignInLinkToEmailOptions,
  ): Promise<void> {
    const auth = getAuth();
    return sendSignInLinkToEmail(
      auth,
      options.email,
      options.actionCodeSettings,
    );
  }

  public async setLanguageCode(options: SetLanguageCodeOptions): Promise<void> {
    const auth = getAuth();
    auth.languageCode = options.languageCode;
  }

  public async setPersistence(options: SetPersistenceOptions): Promise<void> {
    const auth = getAuth();
    switch (options.persistence) {
      case Persistence.BrowserLocal:
        await setPersistence(auth, browserLocalPersistence);
        break;
      case Persistence.BrowserSession:
        await setPersistence(auth, browserSessionPersistence);
        break;
      case Persistence.IndexedDbLocal:
        await setPersistence(auth, indexedDBLocalPersistence);
        break;
      case Persistence.InMemory:
        await setPersistence(auth, inMemoryPersistence);
        break;
    }
  }

  public async setTenantId(options: SetTenantIdOptions): Promise<void> {
    const auth = getAuth();
    auth.tenantId = options.tenantId;
  }

  public async signInAnonymously(): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await signInAnonymously(auth);
    return this.createSignInResult(userCredential, null);
  }

  public async signInWithApple(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new OAuthProvider(ProviderId.APPLE);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithCustomToken(
    options: SignInWithCustomTokenOptions,
  ): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await signInWithCustomToken(auth, options.token);
    return this.createSignInResult(userCredential, null);
  }

  public async signInWithEmailAndPassword(
    options: SignInWithEmailAndPasswordOptions,
  ): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      options.email,
      options.password,
    );
    return this.createSignInResult(userCredential, null);
  }

  public async signInWithEmailLink(
    options: SignInWithEmailLinkOptions,
  ): Promise<SignInResult> {
    const auth = getAuth();
    const userCredential = await signInWithEmailLink(
      auth,
      options.email,
      options.emailLink,
    );
    return this.createSignInResult(userCredential, null);
  }

  public async signInWithFacebook(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new FacebookAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      FacebookAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithGithub(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new GithubAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      GithubAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithGoogle(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new GoogleAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      GoogleAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithMicrosoft(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new OAuthProvider(ProviderId.MICROSOFT);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithOpenIdConnect(
    options: SignInWithOpenIdConnectOptions,
  ): Promise<SignInResult> {
    const provider = new OAuthProvider(options.providerId);
    this.applySignInOptions(options, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithPhoneNumber(
    options: SignInWithPhoneNumberOptions,
  ): Promise<void> {
    if (!options.phoneNumber) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_PHONE_NUMBER_MISSING);
    }
    if (
      !options.recaptchaVerifier ||
      !(options.recaptchaVerifier instanceof RecaptchaVerifier)
    ) {
      throw new Error(
        FirebaseAuthenticationWeb.ERROR_RECAPTCHA_VERIFIER_MISSING,
      );
    }
    const auth = getAuth();
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        options.phoneNumber,
        options.recaptchaVerifier,
      );
      const { verificationId } = confirmationResult;
      this.lastConfirmationResult.set(verificationId, confirmationResult);
      const event: PhoneCodeSentEvent = {
        verificationId,
      };
      this.notifyListeners(
        FirebaseAuthenticationWeb.PHONE_CODE_SENT_EVENT,
        event,
      );
    } catch (error) {
      const event: PhoneVerificationFailedEvent = {
        message: this.getErrorMessage(error),
      };
      this.notifyListeners(
        FirebaseAuthenticationWeb.PHONE_VERIFICATION_FAILED_EVENT,
        event,
      );
    }
  }

  public async signInWithPlayGames(): Promise<SignInResult> {
    this.throwNotAvailableError();
  }

  public async signInWithGameCenter(): Promise<SignInResult> {
    this.throwNotAvailableError();
  }

  public async signInWithTwitter(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new TwitterAuthProvider();
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential =
      TwitterAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signInWithYahoo(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    const provider = new OAuthProvider(ProviderId.YAHOO);
    this.applySignInOptions(options || {}, provider);
    const userCredential = await this.signInWithPopupOrRedirect(
      provider,
      options?.mode,
    );
    const authCredential = OAuthProvider.credentialFromResult(userCredential);
    return this.createSignInResult(userCredential, authCredential);
  }

  public async signOut(): Promise<void> {
    const auth = getAuth();
    await auth.signOut();
  }

  public async unlink(options: UnlinkOptions): Promise<UnlinkResult> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    const user = await unlink(auth.currentUser, options.providerId);
    const userResult = this.createUserResult(user);
    const result: UnlinkResult = {
      user: userResult,
    };
    return result;
  }

  public async updateEmail(options: UpdateEmailOptions): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return updateEmail(currentUser, options.newEmail);
  }

  public async updatePassword(options: UpdatePasswordOptions): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return updatePassword(currentUser, options.newPassword);
  }

  public async updateProfile(options: UpdateProfileOptions): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return updateProfile(currentUser, {
      displayName: options.displayName,
      photoURL: options.photoUrl,
    });
  }

  public async useAppLanguage(): Promise<void> {
    const auth = getAuth();
    auth.useDeviceLanguage();
  }

  public async useEmulator(options: UseEmulatorOptions): Promise<void> {
    const auth = getAuth();
    const port = options.port || 9099;
    const scheme = options.scheme || 'http';
    if (options.host.includes('://')) {
      connectAuthEmulator(auth, `${options.host}:${port}`);
    } else {
      connectAuthEmulator(auth, `${scheme}://${options.host}:${port}`);
    }
  }

  public async verifyBeforeUpdateEmail(
    options: VerifyBeforeUpdateEmailOptions,
  ): Promise<void> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return verifyBeforeUpdateEmail(
      currentUser,
      options?.newEmail,
      options?.actionCodeSettings,
    );
  }

  private handleAuthStateChange(user: FirebaseUser | null): void {
    const userResult = this.createUserResult(user);
    const change: AuthStateChange = {
      user: userResult,
    };
    this.notifyListeners(
      FirebaseAuthenticationWeb.AUTH_STATE_CHANGE_EVENT,
      change,
      true,
    );
  }

  private async handleIdTokenChange(user: FirebaseUser | null): Promise<void> {
    if (!user) {
      return;
    }
    const idToken = await user.getIdToken(false);
    const result: GetIdTokenResult = {
      token: idToken,
    };
    this.notifyListeners(
      FirebaseAuthenticationWeb.ID_TOKEN_CHANGE_EVENT,
      result,
      true,
    );
  }

  private applySignInOptions(
    options: SignInWithOAuthOptions,
    provider: OAuthProvider | GoogleAuthProvider | FacebookAuthProvider,
  ) {
    if (options.customParameters) {
      const customParameters: FirebaseCustomParameters = {};
      options.customParameters.map(parameter => {
        customParameters[parameter.key] = parameter.value;
      });
      provider.setCustomParameters(customParameters);
    }
    if (options.scopes) {
      for (const scope of options.scopes) {
        provider.addScope(scope);
      }
    }
  }

  public signInWithPopupOrRedirect(
    provider: FirebaseAuthProvider,
    mode?: 'popup' | 'redirect',
  ): Promise<FirebaseUserCredential | never> {
    const auth = getAuth();
    if (mode === 'redirect') {
      return signInWithRedirect(auth, provider);
    } else {
      return signInWithPopup(auth, provider);
    }
  }

  public linkCurrentUserWithPopupOrRedirect(
    provider: FirebaseAuthProvider,
    mode?: 'popup' | 'redirect',
  ): Promise<FirebaseUserCredential | never> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    if (mode === 'redirect') {
      return linkWithRedirect(auth.currentUser, provider);
    } else {
      return linkWithPopup(auth.currentUser, provider);
    }
  }

  public linkCurrentUserWithCredential(
    credential: FirebaseAuthCredential,
  ): Promise<FirebaseUserCredential> {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error(FirebaseAuthenticationWeb.ERROR_NO_USER_SIGNED_IN);
    }
    return linkWithCredential(auth.currentUser, credential);
  }

  private createSignInResult(
    userCredential: FirebaseUserCredential | null,
    authCredential: FirebaseAuthCredential | null,
  ): SignInResult {
    const userResult = this.createUserResult(userCredential?.user || null);
    const credentialResult = this.createCredentialResult(authCredential);
    const additionalUserInfoResult =
      this.createAdditionalUserInfoResult(userCredential);
    const result: SignInResult = {
      user: userResult,
      credential: credentialResult,
      additionalUserInfo: additionalUserInfoResult,
    };
    return result;
  }

  private createCredentialResult(
    credential: FirebaseAuthCredential | null,
  ): AuthCredential | null {
    if (!credential) {
      return null;
    }
    const result: AuthCredential = {
      providerId: credential.providerId,
    };
    if (credential instanceof OAuthCredential) {
      result.accessToken = credential.accessToken;
      result.idToken = credential.idToken;
      result.secret = credential.secret;
    }
    return result;
  }

  private createUserResult(user: FirebaseUser | null): User | null {
    if (!user) {
      return null;
    }
    const result: User = {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      metadata: this.createUserMetadataResult(user.metadata),
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL,
      providerData: this.createUserProviderDataResult(user.providerData),
      providerId: user.providerId,
      tenantId: user.tenantId,
      uid: user.uid,
    };
    return result;
  }

  private createUserMetadataResult(
    metadata: FirebaseUserMeatdata,
  ): UserMetadata {
    const result: UserMetadata = {};
    if (metadata.creationTime) {
      result.creationTime = Date.parse(metadata.creationTime);
    }
    if (metadata.lastSignInTime) {
      result.lastSignInTime = Date.parse(metadata.lastSignInTime);
    }
    return result;
  }

  private createUserProviderDataResult(
    providerData: FirebaseUserInfo[],
  ): UserInfo[] {
    return providerData.map(data => ({
      displayName: data.displayName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      photoUrl: data.photoURL,
      providerId: data.providerId,
      uid: data.uid,
    }));
  }

  private createAdditionalUserInfoResult(
    credential: FirebaseUserCredential | null,
  ): AdditionalUserInfo | null {
    if (!credential) {
      return null;
    }
    const additionalUserInfo = getAdditionalUserInfo(credential);
    if (!additionalUserInfo) {
      return null;
    }
    const { isNewUser, profile, providerId, username } = additionalUserInfo;
    const result: AdditionalUserInfo = {
      isNewUser,
    };
    if (providerId !== null) {
      result.providerId = providerId;
    }
    if (profile !== null) {
      result.profile = profile as { [key: string]: unknown };
    }
    if (username !== null && username !== undefined) {
      result.username = username;
    }
    return result;
  }

  private getErrorMessage(error: unknown): string {
    if (
      error instanceof Object &&
      'message' in error &&
      typeof error['message'] === 'string'
    ) {
      return error['message'];
    }
    return JSON.stringify(error);
  }

  private throwNotAvailableError(): never {
    throw new Error('Not available on web.');
  }
}
