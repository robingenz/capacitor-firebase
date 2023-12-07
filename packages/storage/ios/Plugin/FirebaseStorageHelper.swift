import Foundation
import FirebaseStorage
import Capacitor

public class FirebaseStorageHelper {
    public static func buildStorageMetadata(_ metadata: JSObject) -> StorageMetadata {
        let storageMetadata = StorageMetadata()
        if let cacheControl = metadata["cacheControl"] as? String {
            storageMetadata.cacheControl = cacheControl
        }
        if let contentDisposition = metadata["contentDisposition"] as? String {
            storageMetadata.contentDisposition = contentDisposition
        }
        if let contentEncoding = metadata["contentEncoding"] as? String {
            storageMetadata.contentEncoding = contentEncoding
        }
        if let contentLanguage = metadata["contentLanguage"] as? String {
            storageMetadata.contentLanguage = contentLanguage
        }
        if let contentType = metadata["contentType"] as? String {
            storageMetadata.contentType = contentType
        }
        if let customMetadata = metadata["customMetadata"] as? JSObject {
            storageMetadata.customMetadata = self.createHashMapFromJSObject(customMetadata)
        }
        return storageMetadata
    }

    private static func createHashMapFromJSObject(_ object: JSObject) -> [String: String] {
        var map: [String: String] = [:]
        for key in object.keys {
            if let value = object[key] as? String {
                map[key] = value
            }
        }
        return map
    }
}
