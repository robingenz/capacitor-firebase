import Foundation
import FirebaseFirestore
import Capacitor

@objc public class FirestoreFieldValue: NSObject {

    private var method: FirestoreFieldValueMethod

    private var args: [Any]

    private init(method: FirestoreFieldValueMethod, args: [Any]) {
        self.method = method
        self.args = args
    }

    public static func fromJSONObject(_ data: JSObject) -> FirestoreFieldValue {
        return FirestoreFieldValue(
            method: FirestoreFieldValueMethod(rawValue: data["method"]! as! String)!,
            args: FirebaseFirestoreHelper.createObjectFromJSValue(data["args"]!) as! [Any]
        )
    }

    public func getField() -> Any {
        switch method {
        case .arrayRemove: return FieldValue.arrayRemove(args)
        case .arrayUnion: return FieldValue.arrayUnion(args)
        case .deleteField: return FieldValue.delete()
        case .increment:
            if args[0] is Double {
                return FieldValue.increment(args[0] as! Double)
            }
            return FieldValue.increment((args[0] as! NSNumber).int64Value)
        case .serverTimestamp: return FieldValue.serverTimestamp()
        }
    }

}
