import Foundation
import FirebaseFirestore
import Capacitor

public class FirebaseFirestoreHelper {
    public static func createHashMapFromJSObject(_ object: JSObject) -> [String: Any] {
        return createObjectFromJSValue(object) as! [String: Any]
    }

    public static func createObjectFromJSValue(_ value: JSValue) -> Any? {
        if let object = value as? JSObject {
            if FirestoreField.isFirestoreField(object) {
                let field = FirestoreField.fromJSONObject(object)
                return field.getField()
            }
            var map: [String: Any] = [:]
            for key in object.keys {
                if let v = object[key] {
                    map[key] = createObjectFromJSValue(v)
                }
            }
            return map
        }
        if let array = value as? JSArray {
            return array.map { createObjectFromJSValue($0) }
        }

        return value
    }

    public static func createJSObjectFromHashMap(_ map: [String: Any]?) -> JSObject? {
        return createJSValue(map) as? JSObject
    }

    public static func createQueryCompositeFilterConstraintFromJSObject(_ compositeFilter: JSObject?) -> QueryCompositeFilterConstraint? {
        if let compositeFilter = compositeFilter {
            return QueryCompositeFilterConstraint(compositeFilter)
        } else {
            return nil
        }
    }

    public static func createQueryNonFilterConstraintArrayFromJSArray(_ queryConstraints: [JSObject]?) -> [QueryNonFilterConstraint] {
        if let queryConstraints = queryConstraints {
            var queryNonFilterConstraint: [QueryNonFilterConstraint] = []
            for queryConstraint in queryConstraints {
                let queryConstraintType = queryConstraint["type"] as? String
                switch queryConstraintType {
                case "orderBy":
                    let queryOrderByConstraint = QueryOrderByConstraint(queryConstraint)
                    queryNonFilterConstraint.append(queryOrderByConstraint)
                case "limit", "limitToLast":
                    let queryLimitConstraint = QueryLimitConstraint(queryConstraint)
                    queryNonFilterConstraint.append(queryLimitConstraint)
                case "startAt", "startAfter":
                    let queryStartAtConstraint = QueryStartAtConstraint(queryConstraint)
                    queryNonFilterConstraint.append(queryStartAtConstraint)
                case "endAt", "endBefore":
                    let queryEndAtConstraint = QueryEndAtConstraint(queryConstraint)
                    queryNonFilterConstraint.append(queryEndAtConstraint)
                default:
                    break
                }
            }
            return queryNonFilterConstraint
        } else {
            return []
        }
    }

    private static func createJSValue(_ value: Any?) -> JSValue? {
        guard let value = value else {
            return nil
        }

        switch value {
        case let timestampValue as Timestamp:
            do {
                return try FirestoreField.fromObject(timestampValue).getJSObject()
            } catch {
                return nil
            }
        case let stringValue as String:
            return stringValue
        case let numberValue as NSNumber:
            return numberValue
        case let boolValue as Bool:
            return boolValue
        case let intValue as Int:
            return intValue
        case let floatValue as Float:
            return floatValue
        case let doubleValue as Double:
            return doubleValue
        case let dateValue as Date:
            return dateValue
        case let nullValue as NSNull:
            return nullValue
        case let arrayValue as NSArray:
            return arrayValue.compactMap { createJSValue($0) }
        case let dictionaryValue as NSDictionary:
            let keys = dictionaryValue.allKeys.compactMap { $0 as? String }
            var result: JSObject = [:]
            for key in keys {
                result[key] = createJSValue(dictionaryValue[key])
            }
            return result
        default:
            return nil
        }
    }

}
