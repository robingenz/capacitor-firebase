import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
// swiftlint:disable type_body_length
@objc(FirebaseAuthenticationPlugin)
public class FirebaseAuthenticationPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FirebaseAuthenticationPlugin"
    public let jsName = "FirebaseAuthentication"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "applyActionCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "confirmPasswordReset", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "confirmVerificationCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createUserWithEmailAndPassword", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "fetchSignInMethodsForEmail", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getCurrentUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getIdToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPendingAuthResult", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getRedirectResult", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getTenantId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isSignInWithEmailLink", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithApple", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithEmailAndPassword", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithEmailLink", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithFacebook", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithGameCenter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithGithub", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithGoogle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithMicrosoft", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithOpenIdConnect", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithPhoneNumber", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithPlayGames", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithTwitter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "linkWithYahoo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reload", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "revokeAccessToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendEmailVerification", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendPasswordResetEmail", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendSignInLinkToEmail", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setLanguageCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setPersistence", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTenantId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInAnonymously", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithApple", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithCustomToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithEmailAndPassword", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithEmailLink", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithFacebook", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithGameCenter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithGithub", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithGoogle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithMicrosoft", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithPlayGames", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithTwitter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithYahoo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithOpenIdConnect", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signInWithPhoneNumber", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "signOut", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "unlink", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateEmail", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updatePassword", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateProfile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "useAppLanguage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "useEmulator", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "verifyBeforeUpdateEmail", returnType: CAPPluginReturnPromise)
    ]
    public let tag = "FirebaseAuthentication"
    public let errorProviderIdMissing = "providerId must be provided."
    public let errorNoUserSignedIn = "No user is signed in."
    public let errorOobCodeMissing = "oobCode must be provided."
    public let errorTenantIdMissing = "tenantId must be provided."
    public let errorEmailMissing = "email must be provided."
    public let errorNewEmailMissing = "newEmail must be provided."
    public let errorEmailLinkMissing = "emailLink must be provided."
    public let errorActionCodeSettingsMissing = "actionCodeSettings must be provided."
    public let errorPasswordMissing = "password must be provided."
    public let errorNewPasswordMissing = "newPassword must be provided."
    public let errorPhoneNumberMissing = "phoneNumber must be provided."
    public let errorVerificationIdMissing = "verificationId must be provided."
    public let errorVerificationCodeMissing = "verificationCode must be provided."
    public let errorHostMissing = "host must be provided."
    public let errorTokenMissing = "token must be provided."
    public let errorCustomTokenSkipNativeAuth =
        "signInWithCustomToken cannot be used in combination with skipNativeAuth."
    public let errorEmailLinkSignInSkipNativeAuth =
        "signInWithEmailLink cannot be used in combination with skipNativeAuth."
    public let errorEmailSignInSkipNativeAuth =
        "createUserWithEmailAndPassword and signInWithEmailAndPassword cannot be used in combination with skipNativeAuth."
    public let errorSignInAnonymouslySkipNativeAuth =
        "signInAnonymously cannot be used in combination with skipNativeAuth."
    public let errorDeviceUnsupported = "Device is not supported. At least iOS 13 is required."
    public let authStateChangeEvent = "authStateChange"
    public let idTokenChangeEvent = "idTokenChange"
    public let phoneVerificationFailedEvent = "phoneVerificationFailed"
    public let phoneCodeSentEvent = "phoneCodeSent"
    private var implementation: FirebaseAuthentication?

    override public func load() {
        self.implementation = FirebaseAuthentication(plugin: self, config: firebaseAuthenticationConfig())
    }

    @objc func applyActionCode(_ call: CAPPluginCall) {
        guard let oobCode = call.getString("oobCode") else {
            call.reject(errorOobCodeMissing)
            return
        }

        implementation?.applyActionCode(oobCode: oobCode, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func confirmPasswordReset(_ call: CAPPluginCall) {
        guard let oobCode = call.getString("oobCode") else {
            call.reject(errorOobCodeMissing)
            return
        }
        guard let newPassword = call.getString("newPassword") else {
            call.reject(errorNewPasswordMissing)
            return
        }

        implementation?.confirmPasswordReset(oobCode: oobCode, newPassword: newPassword, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func confirmVerificationCode(_ call: CAPPluginCall) {
        guard let verificationId = call.getString("verificationId") else {
            call.reject(errorVerificationIdMissing)
            return
        }
        guard let verificationCode = call.getString("verificationCode") else {
            call.reject(errorVerificationCodeMissing)
            return
        }
        let options = ConfirmVerificationCodeOptions(verificationId: verificationId, verificationCode: verificationCode)

        implementation?.confirmVerificationCode(options, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            if let result = result?.toJSObject() as? JSObject {
                call.resolve(result)
            }
        })
    }

    @objc func createUserWithEmailAndPassword(_ call: CAPPluginCall) {
        implementation?.createUserWithEmailAndPassword(call)
    }

    @objc func deleteUser(_ call: CAPPluginCall) {
        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.deleteUser(user: user, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func fetchSignInMethodsForEmail(_ call: CAPPluginCall) {
        guard let email = call.getString("email") else {
            call.reject(errorEmailMissing)
            return
        }

        let options = FetchSignInMethodsForEmailOptions(email: email)

        implementation?.fetchSignInMethodsForEmail(options, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            if let result = result?.toJSObject() as? JSObject {
                call.resolve(result)
            }
        })
    }

    @objc func getCurrentUser(_ call: CAPPluginCall) {
        let user = implementation?.getCurrentUser()
        let userResult = FirebaseAuthenticationHelper.createUserResult(user)
        var result = JSObject()
        result["user"] = userResult ?? NSNull()
        call.resolve(result)
    }

    @objc func getIdToken(_ call: CAPPluginCall) {
        let forceRefresh = call.getBool("forceRefresh", false)

        implementation?.getIdToken(forceRefresh, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            if let result = result {
                call.resolve(result.toJSObject())
            }
        })
    }

    @objc func getIdTokenResult(_ call: CAPPluginCall) {
        let forceRefresh = call.getBool("forceRefresh", false)

        implementation?.getIdTokenResult(forceRefresh, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            if let result = result {
                call.resolve(result.toJSObject())
            }
        })
    }

    @objc func getPendingAuthResult(_ call: CAPPluginCall) {
        call.reject("Not available on iOS.")
    }

    @objc func getRedirectResult(_ call: CAPPluginCall) {
        call.reject("Not available on iOS.")
    }

    @objc func getTenantId(_ call: CAPPluginCall) {
        let tenantId = implementation?.getTenantId()

        var result = JSObject()
        result["tenantId"] = tenantId ?? NSNull()
        call.resolve(result)
    }

    @objc func isSignInWithEmailLink(_ call: CAPPluginCall) {
        guard let emailLink = call.getString("emailLink") else {
            call.reject(errorEmailLinkMissing)
            return
        }

        var result = JSObject()
        result["isSignInWithEmailLink"] = implementation?.isSignInWithEmailLink(link: emailLink)
        call.resolve(result)
    }

    @objc func linkWithApple(_ call: CAPPluginCall) {
        implementation?.linkWithApple(call)
    }

    @objc func linkWithEmailAndPassword(_ call: CAPPluginCall) {
        implementation?.linkWithEmailAndPassword(call)
    }

    @objc func linkWithEmailLink(_ call: CAPPluginCall) {
        implementation?.linkWithEmailLink(call)
    }

    @objc func linkWithFacebook(_ call: CAPPluginCall) {
        implementation?.linkWithFacebook(call)
    }

    @objc func linkWithGameCenter(_ call: CAPPluginCall) {
        implementation?.linkWithGameCenter(call)
    }

    @objc func linkWithGithub(_ call: CAPPluginCall) {
        implementation?.linkWithGithub(call)
    }

    @objc func linkWithGoogle(_ call: CAPPluginCall) {
        implementation?.linkWithGoogle(call)
    }

    @objc func linkWithMicrosoft(_ call: CAPPluginCall) {
        implementation?.linkWithMicrosoft(call)
    }

    @objc func linkWithOpenIdConnect(_ call: CAPPluginCall) {
        guard let providerId = call.getString("providerId") else {
            call.reject(errorProviderIdMissing)
            return
        }

        implementation?.linkWithOpenIdConnect(call, providerId: providerId)
    }

    @objc func linkWithPhoneNumber(_ call: CAPPluginCall) {
        guard let phoneNumber = call.getString("phoneNumber") else {
            call.reject(errorPhoneNumberMissing)
            return
        }
        let options = LinkWithPhoneNumberOptions(phoneNumber: phoneNumber)

        implementation?.linkWithPhoneNumber(options)
        call.resolve()
    }

    @objc func linkWithPlayGames(_ call: CAPPluginCall) {
        call.reject("Not available on iOS.")
    }

    @objc func linkWithTwitter(_ call: CAPPluginCall) {
        implementation?.linkWithTwitter(call)
    }

    @objc func linkWithYahoo(_ call: CAPPluginCall) {
        implementation?.linkWithYahoo(call)
    }

    @objc func reload(_ call: CAPPluginCall) {
        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.reload(user: user, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func revokeAccessToken(_ call: CAPPluginCall) {
        guard let token = call.getString("token") else {
            call.reject(errorTokenMissing)
            return
        }

        let options = RevokeAccessTokenOptions(token: token)

        implementation?.revokeAccessToken(options, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func sendEmailVerification(_ call: CAPPluginCall) {
        let actionCodeSettings = call.getObject("actionCodeSettings")

        let options = SendEmailVerificationOptions(actionCodeSettings: actionCodeSettings)

        implementation?.sendEmailVerification(options, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func sendPasswordResetEmail(_ call: CAPPluginCall) {
        guard let email = call.getString("email") else {
            call.reject(errorEmailMissing)
            return
        }
        let actionCodeSettings = call.getObject("actionCodeSettings")

        let options = SendPasswordResetEmailOptions(email: email, actionCodeSettings: actionCodeSettings)

        implementation?.sendPasswordResetEmail(options, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func sendSignInLinkToEmail(_ call: CAPPluginCall) {
        guard let email = call.getString("email") else {
            call.reject(errorEmailMissing)
            return
        }
        guard let settings = call.getObject("actionCodeSettings") else {
            call.reject(errorActionCodeSettingsMissing)
            return
        }
        guard let actionCodeSettings = FirebaseAuthenticationHelper.createActionCodeSettings(settings) else {
            call.reject(errorActionCodeSettingsMissing)
            return
        }

        implementation?.sendSignInLinkToEmail(email: email, actionCodeSettings: actionCodeSettings, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func setLanguageCode(_ call: CAPPluginCall) {
        let languageCode = call.getString("languageCode", "")

        implementation?.setLanguageCode(languageCode)
        call.resolve()
    }

    @objc func setPersistence(_ call: CAPPluginCall) {
        call.reject("Not available on iOS.")
    }

    @objc func setTenantId(_ call: CAPPluginCall) {
        guard let tenantId = call.getString("tenantId") else {
            call.reject(errorTenantIdMissing)
            return
        }

        implementation?.setTenantId(tenantId: tenantId)
        call.resolve()
    }

    @objc func signInAnonymously(_ call: CAPPluginCall) {
        implementation?.signInAnonymously(call)
    }

    @objc func signInWithApple(_ call: CAPPluginCall) {
        implementation?.signInWithApple(call)
    }

    @objc func signInWithCustomToken(_ call: CAPPluginCall) {
        implementation?.signInWithCustomToken(call)
    }

    @objc func signInWithEmailAndPassword(_ call: CAPPluginCall) {
        implementation?.signInWithEmailAndPassword(call)
    }

    @objc func signInWithEmailLink(_ call: CAPPluginCall) {
        implementation?.signInWithEmailLink(call)
    }

    @objc func signInWithFacebook(_ call: CAPPluginCall) {
        implementation?.signInWithFacebook(call)
    }

    @objc func signInWithGameCenter(_ call: CAPPluginCall) {
        implementation?.signInWithGameCenter(call)
    }

    @objc func signInWithGithub(_ call: CAPPluginCall) {
        implementation?.signInWithGithub(call)
    }

    @objc func signInWithGoogle(_ call: CAPPluginCall) {
        implementation?.signInWithGoogle(call)
    }

    @objc func signInWithMicrosoft(_ call: CAPPluginCall) {
        implementation?.signInWithMicrosoft(call)
    }

    @objc func signInWithOpenIdConnect(_ call: CAPPluginCall) {
        guard let providerId = call.getString("providerId") else {
            call.reject(errorProviderIdMissing)
            return
        }

        implementation?.signInWithOpenIdConnect(call, providerId: providerId)
    }

    @objc func signInWithPhoneNumber(_ call: CAPPluginCall) {
        let skipNativeAuth = call.getBool("skipNativeAuth", firebaseAuthenticationConfig().skipNativeAuth)
        guard let phoneNumber = call.getString("phoneNumber") else {
            call.reject(errorPhoneNumberMissing)
            return
        }
        let options = SignInWithPhoneNumberOptions(skipNativeAuth: skipNativeAuth, phoneNumber: phoneNumber)

        implementation?.signInWithPhoneNumber(options)
        call.resolve()
    }

    @objc func signInWithPlayGames(_ call: CAPPluginCall) {
        call.reject("Not available on iOS.")
    }

    @objc func signInWithTwitter(_ call: CAPPluginCall) {
        implementation?.signInWithTwitter(call)
    }

    @objc func signInWithYahoo(_ call: CAPPluginCall) {
        implementation?.signInWithYahoo(call)
    }

    @objc func signOut(_ call: CAPPluginCall) {
        implementation?.signOut(call)
    }

    @objc func unlink(_ call: CAPPluginCall) {
        guard let providerId = call.getString("providerId") else {
            call.reject(errorProviderIdMissing)
            return
        }
        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.unlink(user: user, providerId: providerId, completion: { user, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            let userResult = FirebaseAuthenticationHelper.createUserResult(user)
            var result = JSObject()
            result["user"] = userResult ?? NSNull()
            call.resolve(result)
        })
    }

    @objc func updateEmail(_ call: CAPPluginCall) {
        guard let newEmail = call.getString("newEmail") else {
            call.reject(errorNewEmailMissing)
            return
        }
        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.updateEmail(user: user, newEmail: newEmail, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func verifyBeforeUpdateEmail(_ call: CAPPluginCall) {
        guard let newEmail = call.getString("newEmail") else {
            call.reject(errorNewEmailMissing)
            return
        }

        guard let actionCodeSettingsDict = call.getObject("actionCodeSettings") else {
            call.reject(errorActionCodeSettingsMissing)
            return
        }
        guard let actionCodeSettings = FirebaseAuthenticationHelper.createActionCodeSettings(actionCodeSettingsDict) else {
            call.reject(errorActionCodeSettingsMissing)
            return
        }

        implementation?.verifyBeforeUpdateEmail(newEmail, actionCodeSettings: actionCodeSettings, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func updatePassword(_ call: CAPPluginCall) {
        guard let newPassword = call.getString("newPassword") else {
            call.reject(errorNewPasswordMissing)
            return
        }
        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.updatePassword(user: user, newPassword: newPassword, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func updateProfile(_ call: CAPPluginCall) {
        let displayName = call.getString("displayName")
        let photoUrl = call.getString("photoUrl")

        guard let user = implementation?.getCurrentUser() else {
            call.reject(errorNoUserSignedIn)
            return
        }

        implementation?.updateProfile(user: user, displayName: displayName, photoUrl: photoUrl, completion: { error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                let code = FirebaseAuthenticationHelper.createErrorCode(error: error)
                call.reject(error.localizedDescription, code)
                return
            }
            call.resolve()
        })
    }

    @objc func useAppLanguage(_ call: CAPPluginCall) {
        implementation?.useAppLanguage()
        call.resolve()
    }

    @objc func useEmulator(_ call: CAPPluginCall) {
        guard let host = call.getString("host") else {
            call.reject(errorHostMissing)
            return
        }
        let port = call.getInt("port") ?? 9099

        implementation?.useEmulator(host, port)
        call.resolve()
    }

    @objc func handleAuthStateChange() {
        let user = implementation?.getCurrentUser()
        let userResult = FirebaseAuthenticationHelper.createUserResult(user)
        var result = JSObject()
        result["user"] = userResult ?? NSNull()
        notifyListeners(authStateChangeEvent, data: result, retainUntilConsumed: true)
    }

    @objc func handleIdTokenChange() {
        implementation?.getIdToken(false, completion: { result, error in
            if let error = error {
                CAPLog.print("[", self.tag, "] ", error)
                return
            }
            if let result = result {
                self.notifyListeners(self.idTokenChangeEvent, data: result.toJSObject(), retainUntilConsumed: true)
            }
        })
    }

    @objc func handlePhoneVerificationFailed(_ error: Error) {
        CAPLog.print("[", self.tag, "] ", error)
        var result = JSObject()
        result["message"] = error.localizedDescription
        notifyListeners(phoneVerificationFailedEvent, data: result, retainUntilConsumed: true)
    }

    @objc func handlePhoneCodeSent(_ verificationId: String) {
        var result = JSObject()
        result["verificationId"] = verificationId
        notifyListeners(phoneCodeSentEvent, data: result, retainUntilConsumed: true)
    }

    private func firebaseAuthenticationConfig() -> FirebaseAuthenticationConfig {
        var config = FirebaseAuthenticationConfig()

        config.skipNativeAuth = getConfig().getBoolean("skipNativeAuth", config.skipNativeAuth)
        if let providers = getConfig().getArray("providers") as? [String] {
            config.providers = providers
        }

        return config
    }
}
