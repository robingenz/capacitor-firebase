import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth

public enum ProviderId: String {
    case APPLE = "apple.com"
    case FACEBOOK = "facebook.com"
    case GITHUB = "github.com"
    case GOOGLE = "google.com"
    case MICROSOFT = "microsoft.com"
    case PLAY_GAMES = "playgames.google.com"
    case TWITTER = "twitter.com"
    case YAHOO = "yahoo.com"

    case FIREBASE = "firebase"
    case PASSWORD = "password"
    case PHONE = "phone"
}

public enum SignInMethod: String {
    case EMAIL_LINK = "emailLink"
    case EMAIL_PASSWORD = "password"
    case PHONE = "phone"
}

public class FirebaseAuthenticationHelper {
    public static func createSignInResult(credential: AuthCredential?, user: User?, idToken: String?, nonce: String?, accessToken: String?, additionalUserInfo: AdditionalUserInfo?) -> JSObject {
        let userResult = self.createUserResult(user)
        let credentialResult = self.createCredentialResult(credential, idToken: idToken, nonce: nonce, accessToken: accessToken)
        let additionalUserInfoResult = self.createAdditionalUserInfoResult(additionalUserInfo)
        var result = JSObject()
        result["user"] = userResult
        result["credential"] = credentialResult
        result["additionalUserInfo"] = additionalUserInfoResult
        return result
    }

    public static func createUserResult(_ user: User?) -> JSObject? {
        guard let user = user else {
            return nil
        }
        var result = JSObject()
        result["displayName"] = user.displayName
        result["email"] = user.email
        result["emailVerified"] = user.isEmailVerified
        result["isAnonymous"] = user.isAnonymous
        result["phoneNumber"] = user.phoneNumber
        result["photoUrl"] = user.photoURL?.absoluteString
        result["providerId"] = user.providerID
        result["tenantId"] = user.tenantID
        result["uid"] = user.uid
        return result
    }

    public static func createCredentialResult(_ credential: AuthCredential?, idToken: String?, nonce: String?, accessToken: String?) -> JSObject? {
        if credential == nil && idToken == nil && nonce == nil && accessToken == nil {
            return nil
        }
        var result = JSObject()
        if let credential = credential {
            result["providerId"] = credential.provider
            if let oAuthCredential = credential as? OAuthCredential {
                let oAuthAccessToken = oAuthCredential.accessToken
                if oAuthAccessToken != nil {
                    result["accessToken"] = oAuthAccessToken
                }
                let oAuthIdToken = oAuthCredential.idToken
                if oAuthIdToken != nil {
                    result["idToken"] = oAuthIdToken
                }
                let oAuthSecret = oAuthCredential.secret
                if oAuthSecret != nil {
                    result["secret"] = oAuthSecret
                }
            }
        }
        if let idToken = idToken {
            result["idToken"] = idToken
        }
        if let nonce = nonce {
            result["nonce"] = nonce
        }
        if let accessToken = accessToken {
            result["accessToken"] = accessToken
        }
        return result
    }

    public static func createAdditionalUserInfoResult(_ additionalUserInfo: AdditionalUserInfo?) -> JSObject? {
        guard let additionalUserInfo = additionalUserInfo else {
            return nil
        }
        var result = JSObject()
        result["isNewUser"] = additionalUserInfo.isNewUser
        if let profile = additionalUserInfo.profile {
            result["profile"] = JSTypes.coerceDictionaryToJSObject(profile) ?? [:]
        }
        result["providerId"] = additionalUserInfo.providerID
        if let username = additionalUserInfo.username {
            result["username"] = username
        }
        return result
    }
}
