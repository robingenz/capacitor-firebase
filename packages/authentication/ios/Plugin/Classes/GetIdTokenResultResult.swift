import Foundation
import FirebaseAuth
import Capacitor

@objc class GetIdTokenResultResult: NSObject {
    let tokenResult: AuthTokenResult? 

    init(tokenResult: AuthTokenResult?) { 
        self.tokenResult = tokenResult
    }

    func toJSObject() -> JSObject {
        var result = JSObject()
        
        if let tokenResult = tokenResult {
            let dateFormatter = ISO8601DateFormatter()
            
            result["authTime"] = dateFormatter.string(from: tokenResult.authDate)  
            result["expirationTime"] = dateFormatter.string(from: tokenResult.expirationDate)
            result["issuedAtTime"] = dateFormatter.string(from: tokenResult.issuedAtDate)  
            result["signInProvider"] = tokenResult.signInProvider
            result["signInSecondFactor"] = tokenResult.signInSecondFactor
            
            var claims = JSObject()
            for (key, value) in tokenResult.claims {
                if let jsonValue = value as? JSValue {
                    claims[key] = jsonValue
                }
            }
            result["claims"] = claims
        }
        
        return result
    }
}
