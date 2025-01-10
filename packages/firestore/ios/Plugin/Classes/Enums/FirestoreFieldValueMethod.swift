import Foundation

enum FirestoreFieldValueMethod: String {
    case arrayRemove = "arrayRemove"
    case arrayUnion = "arrayUnion"
    case deleteField = "deleteField"
    case increment = "increment"
    case serverTimestamp = "serverTimestamp"
}
