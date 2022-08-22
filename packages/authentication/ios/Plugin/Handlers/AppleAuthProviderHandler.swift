import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth
import AuthenticationServices
import CryptoKit

class AppleAuthProviderHandler: NSObject {
    var pluginImplementation: FirebaseAuthentication
    fileprivate var nonce: String?
    fileprivate var success: AuthSuccessHandler?
    fileprivate var failure: AuthFailureHandler?

    init(_ pluginImplementation: FirebaseAuthentication) {
        self.pluginImplementation = pluginImplementation
    }

    func link(call: CAPPluginCall) {
        if #available(iOS 13, *) {
            self.dispatch(call, success: self.pluginImplementation.handleSuccessfulLink, failure: self.pluginImplementation.handleFailedLink)
        } else {
            call.reject(self.pluginImplementation.getPlugin().errorDeviceUnsupported)
        }
    }

    func signIn(call: CAPPluginCall) {
        if #available(iOS 13, *) {
            self.dispatch(call, success: self.pluginImplementation.handleSuccessfulSignIn, failure: self.pluginImplementation.handleFailedSignIn)
        } else {
            call.reject(self.pluginImplementation.getPlugin().errorDeviceUnsupported)
        }
    }
}

// Source: https://firebase.google.com/docs/auth/ios/apple
@available(iOS 13.0, *)
extension AppleAuthProviderHandler: ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return (self.pluginImplementation.getPlugin().bridge?.webView?.window)!
    }

    // Adapted from https://auth0.com/docs/api-auth/tutorials/nonce#generate-a-cryptographically-random-nonce
    private func randomNonceString(length: Int = 32) -> String {
        precondition(length > 0)
        let charset: [Character] =
            Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        var result = ""
        var remainingLength = length

        while remainingLength > 0 {
            let randoms: [UInt8] = (0 ..< 16).map { _ in
                var random: UInt8 = 0
                let errorCode = SecRandomCopyBytes(kSecRandomDefault, 1, &random)
                if errorCode != errSecSuccess {
                    fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
                }
                return random
            }

            randoms.forEach { random in
                if remainingLength == 0 {
                    return
                }

                if random < charset.count {
                    result.append(charset[Int(random)])
                    remainingLength -= 1
                }
            }
        }

        return result
    }

    @available(iOS 13, *)
    func dispatch(_ call: CAPPluginCall, success: @escaping AuthSuccessHandler, failure: @escaping AuthFailureHandler) {
        self.success = success
        self.failure = failure

        let nonce = randomNonceString()
        self.nonce = nonce
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = sha256(nonce)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.presentationContextProvider = self
        authorizationController.performRequests()
    }

    @available(iOS 13, *)
    private func sha256(_ input: String) -> String {
        let inputData = Data(input.utf8)
        let hashedData = SHA256.hash(data: inputData)
        let hashString = hashedData.compactMap {
            return String(format: "%02x", $0)
        }.joined()

        return hashString
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            return
        }
        guard let nonce = self.nonce else {
            fatalError("Invalid state: A login callback was received, but no login request was sent.")
        }
        guard let appleIDToken = appleIDCredential.identityToken else {
            print("Unable to fetch identity token")
            return
        }
        guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
            print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
            return
        }
        let credential = OAuthProvider.credential(withProviderID: ProviderId.APPLE.rawValue, idToken: idTokenString, rawNonce: nonce)
        self.success!((credential: credential, idToken: idTokenString, nonce: nonce, accessToken: nil))
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        self.failure!((message: nil, error: error))
    }
}
