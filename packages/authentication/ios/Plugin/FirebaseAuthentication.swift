import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth

public typealias AuthStateChangedObserver = () -> Void

// swiftlint:disable type_body_length
@objc public class FirebaseAuthentication: NSObject {
    private let plugin: FirebaseAuthenticationPlugin
    private let config: FirebaseAuthenticationConfig
    private var appleAuthProviderHandler: AppleAuthProviderHandler?
    private var gameCenterAuthProviderHandler: GameCenterAuthProviderHandler?
    private var facebookAuthProviderHandler: FacebookAuthProviderHandler?
    private var googleAuthProviderHandler: GoogleAuthProviderHandler?
    private var oAuthProviderHandler: OAuthProviderHandler?
    private var phoneAuthProviderHandler: PhoneAuthProviderHandler?
    private var savedCall: CAPPluginCall?

    init(plugin: FirebaseAuthenticationPlugin, config: FirebaseAuthenticationConfig) {
        self.plugin = plugin
        self.config = config
        super.init()
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
        }
        self.initAuthProviderHandlers(config: config)
        Auth.auth().addStateDidChangeListener {_, _ in
            self.plugin.handleAuthStateChange()
        }
        _ = Auth.auth().addIDTokenDidChangeListener {_, _ in
            self.plugin.handleIdTokenChange()
        }
    }

    @objc func applyActionCode(oobCode: String, completion: @escaping (Error?) -> Void) {
        return Auth.auth().applyActionCode(oobCode, completion: { error in
            completion(error)
        })
    }

    @objc func createUserWithEmailAndPassword(_ call: CAPPluginCall) {
        let skipNativeAuth = call.getBool("skipNativeAuth", config.skipNativeAuth)
        if skipNativeAuth == true {
            call.reject(plugin.errorEmailSignInSkipNativeAuth)
            return
        }

        guard let email = call.getString("email") else {
            call.reject(plugin.errorEmailMissing)
            return
        }
        guard let password = call.getString("password") else {
            call.reject(plugin.errorPasswordMissing)
            return
        }

        self.savedCall = call
        return Auth.auth().createUser(withEmail: email, password: password) { _, error in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let user = self.getCurrentUser()
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: nil, user: user, idToken: nil, nonce: nil,
                                                                         accessToken: nil, additionalUserInfo: nil)
            savedCall.resolve(result)
        }
    }

    @objc func confirmPasswordReset(oobCode: String, newPassword: String, completion: @escaping (Error?) -> Void) {
        return Auth.auth().confirmPasswordReset(withCode: oobCode, newPassword: newPassword, completion: { error in
            completion(error)
        })
    }

    @objc func confirmVerificationCode(_ options: ConfirmVerificationCodeOptions, completion: @escaping (Result?, Error?) -> Void) {
        self.phoneAuthProviderHandler?.confirmVerificationCode(options, completion: completion)
    }

    @objc func deleteUser(user: User, completion: @escaping (Error?) -> Void) {
        user.delete { error in
            completion(error)
        }
    }

    @objc func fetchSignInMethodsForEmail(_ options: FetchSignInMethodsForEmailOptions, completion: @escaping (Result?, Error?) -> Void) {
        let email = options.getEmail()

        Auth.auth().fetchSignInMethods(forEmail: email) { signInMethods, error in
            if let error = error {
                completion(nil, error)
                return
            }
            let result = FetchSignInMethodsForEmailResult(signInMethods ?? [])
            completion(result, nil)
        }
    }

    @objc func getCurrentUser() -> User? {
        return Auth.auth().currentUser
    }

    @objc func getIdToken(_ forceRefresh: Bool, completion: @escaping (GetIdTokenResult?, Error?) -> Void) {
        guard let user = self.getCurrentUser() else {
            let error = RuntimeError(self.plugin.errorNoUserSignedIn)
            completion(nil, error)
            return
        }
        user.getIDTokenResult(forcingRefresh: forceRefresh, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.plugin.tag, "] ", error)
                completion(nil, error)
                return
            }
            let result = GetIdTokenResult(token: result?.token ?? "")
            completion(result, nil)
        })
    }

    @objc func getIdTokenResult(_ forceRefresh: Bool, completion: @escaping (GetIdTokenResultResult?, Error?) -> Void) {
        guard let user = self.getCurrentUser() else {
            let error = RuntimeError(self.plugin.errorNoUserSignedIn)
            completion(nil, error)
            return
        }        
        user.getIDTokenResult(forcingRefresh: forceRefresh) { tokenResult, error in
            if let error = error {
                CAPLog.print("[", self.plugin.tag, "] ", error)
                completion(nil, error)
                return
            }            
            let idTokenResult = GetIdTokenResultResult(tokenResult: tokenResult)
            completion(idTokenResult, nil)
        }
    }

    @objc func getTenantId() -> String? {
        return Auth.auth().tenantID
    }

    @objc func isSignInWithEmailLink(link: String) -> Bool {
        return Auth.auth().isSignIn(withEmailLink: link)
    }

    @objc func linkWithApple(_ call: CAPPluginCall) {
        self.savedCall = call
        self.appleAuthProviderHandler?.link(call: call)
    }

    @objc func linkWithEmailAndPassword(_ call: CAPPluginCall) {
        let skipNativeAuth = call.getBool("skipNativeAuth", config.skipNativeAuth)
        if skipNativeAuth == true {
            call.reject(plugin.errorEmailSignInSkipNativeAuth)
            return
        }
        guard let user = self.getCurrentUser() else {
            call.reject(plugin.errorNoUserSignedIn)
            return
        }

        let email = call.getString("email", "")
        let password = call.getString("password", "")

        let credential = EmailAuthProvider.credential(withEmail: email, password: password)

        self.savedCall = call
        user.link(with: credential) { authResult, error in
            if let error = error {
                self.handleFailedLink(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user,
                                                                         idToken: nil, nonce: nil, accessToken: nil,
                                                                         additionalUserInfo: authResult?.additionalUserInfo)
            savedCall.resolve(result)
        }
    }

    @objc func linkWithEmailLink(_ call: CAPPluginCall) {
        guard let user = self.getCurrentUser() else {
            call.reject(plugin.errorNoUserSignedIn)
            return
        }

        let email = call.getString("email", "")
        let emailLink = call.getString("emailLink", "")

        let credential = EmailAuthProvider.credential(withEmail: email, link: emailLink)

        self.savedCall = call
        user.link(with: credential) { authResult, error in
            if let error = error {
                self.handleFailedLink(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user,
                                                                         idToken: nil, nonce: nil, accessToken: nil,
                                                                         additionalUserInfo: authResult?.additionalUserInfo)
            savedCall.resolve(result)
        }
    }

    @objc func linkWithFacebook(_ call: CAPPluginCall) {
        self.savedCall = call
        self.facebookAuthProviderHandler?.link(call: call)
    }

    @objc func linkWithGameCenter(_ call: CAPPluginCall) {
        self.savedCall = call
        self.gameCenterAuthProviderHandler?.link(call: call)
    }

    @objc func linkWithGithub(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.link(call: call, providerId: ProviderId.gitHub)
    }

    @objc func linkWithGoogle(_ call: CAPPluginCall) {
        self.savedCall = call
        self.googleAuthProviderHandler?.link(call: call)
    }

    @objc func linkWithMicrosoft(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.link(call: call, providerId: ProviderId.microsoft)
    }

    @objc func linkWithOpenIdConnect(_ call: CAPPluginCall, providerId: String) {
        self.savedCall = call
        self.oAuthProviderHandler?.link(call: call, providerId: providerId)
    }

    @objc func linkWithPhoneNumber(_ options: LinkWithPhoneNumberOptions) {
        self.phoneAuthProviderHandler?.link(options)
    }

    @objc func linkWithTwitter(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.link(call: call, providerId: ProviderId.twitter)
    }

    @objc func linkWithYahoo(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.link(call: call, providerId: ProviderId.yahoo)
    }

    @objc func reload(user: User, completion: @escaping (Error?) -> Void) {
        user.reload { error in
            completion(error)
        }
    }

    @objc func revokeAccessToken(_ options: RevokeAccessTokenOptions, completion: @escaping (Error?) -> Void) {
        let token = options.getToken()

        Auth.auth().revokeToken(withAuthorizationCode: token) { error in
            completion(error)
        }
    }

    @objc func sendEmailVerification(_ options: SendEmailVerificationOptions, completion: @escaping (Error?) -> Void) {
        let actionCodeSettings = options.getActionCodeSettings()

        guard let user = self.getCurrentUser() else {
            completion(RuntimeError(plugin.errorNoUserSignedIn))
            return
        }

        let completion: (Error?) -> Void = { error in
            completion(error)
        }
        if let actionCodeSettings = actionCodeSettings {
            user.sendEmailVerification(with: actionCodeSettings, completion: completion)
        } else {
            user.sendEmailVerification(completion: completion)
        }
    }

    @objc func verifyBeforeUpdateEmail(_ newEmail: String, actionCodeSettings: ActionCodeSettings, completion: @escaping (Error?) -> Void) {
        guard let user = self.getCurrentUser() else {
            completion(RuntimeError(plugin.errorNoUserSignedIn))
            return
        }

        let completion: (Error?) -> Void = { error in
            completion(error)
        }

        user.sendEmailVerification(beforeUpdatingEmail: newEmail, actionCodeSettings: actionCodeSettings, completion: completion)
    }

    @objc func sendPasswordResetEmail(_ options: SendPasswordResetEmailOptions, completion: @escaping (Error?) -> Void) {
        let email = options.getEmail()
        let actionCodeSettings = options.getActionCodeSettings()

        let completion: (Error?) -> Void = { error in
            completion(error)
        }
        if let actionCodeSettings = actionCodeSettings {
            Auth.auth().sendPasswordReset(withEmail: email, actionCodeSettings: actionCodeSettings, completion: completion)
        } else {
            Auth.auth().sendPasswordReset(withEmail: email, completion: completion)
        }
    }

    @objc func sendSignInLinkToEmail(email: String, actionCodeSettings: ActionCodeSettings, completion: @escaping (Error?) -> Void) {
        return Auth.auth().sendSignInLink(toEmail: email, actionCodeSettings: actionCodeSettings) { error in
            completion(error)
        }
    }

    @objc func setLanguageCode(_ languageCode: String) {
        Auth.auth().languageCode = languageCode
    }

    @objc func setTenantId(tenantId: String) {
        Auth.auth().tenantID = tenantId
    }

    @objc func signInAnonymously(_ call: CAPPluginCall) {
        let skipNativeAuth = config.skipNativeAuth
        if skipNativeAuth == true {
            call.reject(plugin.errorSignInAnonymouslySkipNativeAuth)
            return
        }
        self.savedCall = call
        Auth.auth().signInAnonymously { authResult, error in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user,
                                                                         idToken: nil, nonce: nil, accessToken: nil,
                                                                         additionalUserInfo: authResult?.additionalUserInfo)
            savedCall.resolve(result)
        }
    }

    @objc func signInWithApple(_ call: CAPPluginCall) {
        self.savedCall = call
        self.appleAuthProviderHandler?.signIn(call: call)
    }

    @objc func signInWithCustomToken(_ call: CAPPluginCall) {
        let skipNativeAuth = call.getBool("skipNativeAuth", config.skipNativeAuth)
        if skipNativeAuth == true {
            call.reject(plugin.errorCustomTokenSkipNativeAuth)
            return
        }

        let token = call.getString("token", "")

        self.savedCall = call
        Auth.auth().signIn(withCustomToken: token) { _, error in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let user = self.getCurrentUser()
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: nil, user: user, idToken: nil, nonce: nil,
                                                                         accessToken: nil, additionalUserInfo: nil)
            savedCall.resolve(result)
        }
    }

    @objc func signInWithEmailAndPassword(_ call: CAPPluginCall) {
        let skipNativeAuth = config.skipNativeAuth
        if skipNativeAuth == true {
            call.reject(plugin.errorEmailSignInSkipNativeAuth)
            return
        }

        let email = call.getString("email", "")
        let password = call.getString("password", "")

        self.savedCall = call
        Auth.auth().signIn(withEmail: email, password: password) { _, error in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let user = self.getCurrentUser()
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: nil, user: user, idToken: nil, nonce: nil,
                                                                         accessToken: nil, additionalUserInfo: nil)
            savedCall.resolve(result)
        }
    }

    @objc func signInWithEmailLink(_ call: CAPPluginCall) {
        let skipNativeAuth = config.skipNativeAuth
        if skipNativeAuth == true {
            call.reject(plugin.errorEmailLinkSignInSkipNativeAuth)
            return
        }

        let email = call.getString("email", "")
        let emailLink = call.getString("emailLink", "")

        self.savedCall = call
        Auth.auth().signIn(withEmail: email, link: emailLink) { authResult, error in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user,
                                                                         idToken: nil, nonce: nil, accessToken: nil,
                                                                         additionalUserInfo: authResult?.additionalUserInfo)
            savedCall.resolve(result)
        }
    }

    @objc func signInWithFacebook(_ call: CAPPluginCall) {
        self.savedCall = call
        self.facebookAuthProviderHandler?.signIn(call: call)
    }

    @objc func signInWithGameCenter(_ call: CAPPluginCall) {
        self.savedCall = call
        self.gameCenterAuthProviderHandler?.signIn(call: call)
    }

    @objc func signInWithGithub(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.signIn(call: call, providerId: ProviderId.gitHub)
    }

    @objc func signInWithGoogle(_ call: CAPPluginCall) {
        self.savedCall = call
        self.googleAuthProviderHandler?.signIn(call: call)
    }

    @objc func signInWithMicrosoft(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.signIn(call: call, providerId: ProviderId.microsoft)
    }

    @objc func signInWithOpenIdConnect(_ call: CAPPluginCall, providerId: String) {
        self.savedCall = call
        self.oAuthProviderHandler?.signIn(call: call, providerId: providerId)
    }

    @objc func signInWithPhoneNumber(_ options: SignInWithPhoneNumberOptions) {
        self.phoneAuthProviderHandler?.signIn(options)
    }

    @objc func signInWithTwitter(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.signIn(call: call, providerId: ProviderId.twitter)
    }

    @objc func signInWithYahoo(_ call: CAPPluginCall) {
        self.savedCall = call
        self.oAuthProviderHandler?.signIn(call: call, providerId: ProviderId.yahoo)
    }

    @objc func signOut(_ call: CAPPluginCall) {
        do {
            try Auth.auth().signOut()
            googleAuthProviderHandler?.signOut()
            facebookAuthProviderHandler?.signOut()
            call.resolve()
        } catch {
            CAPLog.print("[", self.plugin.tag, "] ", error)
            let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
            call.reject(error.localizedDescription, code)
        }
    }

    @objc func unlink(user: User, providerId: String, completion: @escaping (User?, Error?) -> Void) {
        user.unlink(fromProvider: providerId) { user, error in
            completion(user, error)
        }
    }

    @objc func updateEmail(user: User, newEmail: String, completion: @escaping (Error?) -> Void) {
        user.updateEmail(to: newEmail) { error in
            completion(error)
        }
    }

    @objc func updatePassword(user: User, newPassword: String, completion: @escaping (Error?) -> Void) {
        user.updatePassword(to: newPassword) { error in
            completion(error)
        }
    }

    @objc func updateProfile(user: User, displayName: String?, photoUrl: String?, completion: @escaping (Error?) -> Void) {
        let changeRequest = user.createProfileChangeRequest()

        if displayName != nil {
            changeRequest.displayName = displayName
        }
        if photoUrl != nil {
            changeRequest.photoURL = URL(string: photoUrl!)
        }

        changeRequest.commitChanges { error in
            completion(error)
        }
    }

    @objc func useAppLanguage() {
        Auth.auth().useAppLanguage()
    }

    @objc func useEmulator(_ host: String, _ port: Int) {
        Auth.auth().useEmulator(withHost: host, port: port)
    }

    @objc func signInWithCredential(
        _ options: SignInOptions,
        credential: AuthCredential,
        completion: @escaping (Result?, Error?) -> Void
    ) {
        let skipNativeAuth = options.getSkipNativeAuth()
        if skipNativeAuth == true {
            let result = SignInResult(user: nil, credential: credential, additionalUserInfo: nil)
            completion(result, nil)
            return
        }
        Auth.auth().signIn(with: credential) { (authResult, error) in
            if let error = error {
                completion(nil, error)
                return
            }
            if let authResult = authResult {
                let result = SignInResult(authResult)
                completion(result, nil)
            }
        }
    }

    @objc func linkWithCredential(
        credential: AuthCredential,
        completion: @escaping (Result?, Error?) -> Void
    ) {
        guard let user = getCurrentUser() else {
            completion(nil, RuntimeError(plugin.errorNoUserSignedIn))
            return
        }
        user.link(with: credential) { (authResult, error) in
            if let error = error {
                completion(nil, error)
                return
            }
            if let authResult = authResult {
                let result = SignInResult(authResult)
                completion(result, nil)
            }
        }
    }

    func handleSuccessfulSignIn(credential: AuthCredential, idToken: String?, nonce: String?, accessToken: String?, displayName: String?, authorizationCode: String?, serverAuthCode: String?) {
        guard let savedCall = self.savedCall else {
            return
        }
        let skipNativeAuth = savedCall.getBool("skipNativeAuth", config.skipNativeAuth)
        if skipNativeAuth == true {
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: credential, user: nil, idToken: idToken,
                                                                         nonce: nonce, accessToken: accessToken, serverAuthCode: serverAuthCode,
                                                                         additionalUserInfo: nil, displayName: displayName,
                                                                         authorizationCode: authorizationCode)
            savedCall.resolve(result)
            return
        }
        Auth.auth().signIn(with: credential) { (authResult, error) in
            if let error = error {
                self.handleFailedSignIn(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user, idToken: idToken,
                                                                         nonce: nonce, accessToken: accessToken, serverAuthCode: serverAuthCode,
                                                                         additionalUserInfo: authResult?.additionalUserInfo, displayName: displayName,
                                                                         authorizationCode: authorizationCode)
            savedCall.resolve(result)
        }
    }

    func handleFailedSignIn(message: String?, error: Error?) {
        guard let savedCall = self.savedCall else {
            return
        }
        let errorMessage = message ?? error?.localizedDescription ?? ""
        CAPLog.print("[", self.plugin.tag, "] ", errorMessage)
        let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
        savedCall.reject(errorMessage, code)
    }

    func handleSuccessfulLink(credential: AuthCredential, idToken: String?, nonce: String?, accessToken: String?, serverAuthCode: String?, displayName: String?, authorizationCode: String?) {
        guard let user = getCurrentUser() else {
            self.handleFailedLink(message: plugin.errorNoUserSignedIn, error: nil)
            return
        }
        user.link(with: credential) { (authResult, error) in
            if let error = error {
                self.handleFailedLink(message: nil, error: error)
                return
            }
            guard let savedCall = self.savedCall else {
                return
            }
            let result = FirebaseAuthenticationHelper.createSignInResult(credential: authResult?.credential, user: authResult?.user, idToken: idToken,
                                                                         nonce: nonce, accessToken: accessToken,
                                                                         serverAuthCode: serverAuthCode, additionalUserInfo: authResult?.additionalUserInfo,
                                                                         displayName: displayName, authorizationCode: authorizationCode)
            savedCall.resolve(result)
        }
    }

    func handleFailedLink(message: String?, error: Error?) {
        guard let savedCall = self.savedCall else {
            return
        }
        let errorMessage = message ?? error?.localizedDescription ?? ""
        CAPLog.print("[", self.plugin.tag, "] ", errorMessage)
        let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
        savedCall.reject(errorMessage, code)
    }

    func handlePhoneVerificationFailed(_ error: Error) {
        plugin.handlePhoneVerificationFailed(error)
    }

    func handlePhoneCodeSent(_ verificationId: String) {
        plugin.handlePhoneCodeSent(verificationId)
    }

    func getPlugin() -> FirebaseAuthenticationPlugin {
        return self.plugin
    }

    func getConfig() -> FirebaseAuthenticationConfig {
        return self.config
    }

    private func initAuthProviderHandlers(config: FirebaseAuthenticationConfig) {
        if config.providers.contains(ProviderId.apple) {
            self.appleAuthProviderHandler = AppleAuthProviderHandler(self)
        }
        if config.providers.contains(ProviderId.gameCenter) {
            self.gameCenterAuthProviderHandler = GameCenterAuthProviderHandler(self)
        }
        if config.providers.contains(ProviderId.facebook) {
            self.facebookAuthProviderHandler = FacebookAuthProviderHandler(self)
        }
        if config.providers.contains(ProviderId.google) {
            self.googleAuthProviderHandler = GoogleAuthProviderHandler(self)
        }
        if config.providers.contains(ProviderId.phone) {
            self.phoneAuthProviderHandler = PhoneAuthProviderHandler(self)
        }
        self.oAuthProviderHandler = OAuthProviderHandler(self)
    }
}
