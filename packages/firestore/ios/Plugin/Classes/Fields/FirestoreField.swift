import Foundation
import FirebaseFirestore
import Capacitor

@objc public class FirestoreField: NSObject {

    private static var FIRESTORE_FIELD_TYPE = "_capacitorFirestoreFieldType"
    private static var FIRESTORE_FIELD_VALUE = "_capacitorFirestoreFieldValue"

    private var type: FirestoreFieldType

    private var value: JSObject

    private init(type: FirestoreFieldType, value: JSObject) {
        self.type = type
        self.value = value
    }

    public static func isFirestoreField(_ firestoreFieldData: JSObject) -> Bool {
        return firestoreFieldData[FIRESTORE_FIELD_TYPE] != nil
    }

    public static func fromJSONObject(_ data: JSObject) -> FirestoreField {
        return FirestoreField(
            type: FirestoreFieldType(rawValue: data[FIRESTORE_FIELD_TYPE]! as! String)!,
            value: data[FIRESTORE_FIELD_VALUE]! as! JSObject
        )
    }

    public static func fromObject(_ object: Any) throws -> FirestoreField {
        if object is Timestamp {
            let timestamp = FirestoreTimestamp.fromFirestore(object as! Timestamp)
            return FirestoreField(type: .timestamp, value: timestamp.getValue())
        }
        throw FirebaseFirestoreError.invalidArgumant("The provided object is not a firestore field")
    }

    public func getField() -> Any {
        switch type {
        case .fieldValue: return FirestoreFieldValue.fromJSONObject(value).getField()
        case .timestamp: return FirestoreTimestamp.fromJSONObject(value).getField()
        }
    }

    public func getJSObject() -> JSObject {
        var object: JSObject = [:]
        object[FirestoreField.FIRESTORE_FIELD_TYPE] = type.rawValue
        object[FirestoreField.FIRESTORE_FIELD_VALUE] = value
        return object
    }

}
