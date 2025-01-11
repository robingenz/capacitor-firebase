// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorFirebasePerformance",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorFirebasePerformance",
            targets: ["FirebasePerformancePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "6.0.0"),
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", .upToNextMajor(from: "11.0"))
    ],
    targets: [
        .target(
            name: "FirebasePerformancePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "FirebaseCore", package: "Firebase"),
                .product(name: "FirebasePerformance", package: "Firebase")
            ],
            path: "ios/Sources/FirebasePerformancePlugin"),
        .testTarget(
            name: "FirebasePerformancePluginTests",
            dependencies: ["FirebasePerformancePlugin"],
            path: "ios/Tests/FirebasePerformancePluginTests")
    ]
)
