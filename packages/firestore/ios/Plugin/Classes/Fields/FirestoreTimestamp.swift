import Foundation
import FirebaseFirestore
import Capacitor

@objc public class FirestoreTimestamp: NSObject {

    private var seconds: Int64

    private var nanoseconds: Int32

    private init(seconds: Int64, nanoseconds: Int32) {
        self.seconds = seconds
        self.nanoseconds = nanoseconds
    }

    public static func fromJSONObject(_ value: JSObject) -> FirestoreTimestamp {
        return FirestoreTimestamp(seconds: Int64(value["seconds"] as! Int), nanoseconds: Int32(value["nanoseconds"] as! Int))
    }

    public static func fromFirestore(_ timestamp: Timestamp) -> FirestoreTimestamp {
        return FirestoreTimestamp(seconds: timestamp.seconds, nanoseconds: timestamp.nanoseconds)
    }

    public func getValue() -> JSObject {
        var value: JSObject = [:]
        value["seconds"] = NSNumber(value: seconds)
        value["nanoseconds"] = NSNumber(value: nanoseconds)
        return value
    }

    public func getField() -> Timestamp {
        return Timestamp(seconds: seconds, nanoseconds: nanoseconds)
    }

}
