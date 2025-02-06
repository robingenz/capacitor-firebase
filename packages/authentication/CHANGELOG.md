# Changelog

## 7.1.0

## 7.0.0

### Major Changes

- [`5c70cf954a48fa579bee9bd95e566201dc563a41`](https://github.com/capawesome-team/capacitor-firebase/commit/5c70cf954a48fa579bee9bd95e566201dc563a41) ([#805](https://github.com/capawesome-team/capacitor-firebase/pull/805)): refactor: add prefix to error codes on Android and iOS to be consistent with the Firebase Web SDK

- [`604c69719fd84261115dd6fca9271f62bf1c1df9`](https://github.com/capawesome-team/capacitor-firebase/commit/604c69719fd84261115dd6fca9271f62bf1c1df9) ([#807](https://github.com/capawesome-team/capacitor-firebase/pull/807)): feat: update to Capacitor 7

- [`e1d28962d4cb3a772940a61703f7c5ad21f1f994`](https://github.com/capawesome-team/capacitor-firebase/commit/e1d28962d4cb3a772940a61703f7c5ad21f1f994) ([#806](https://github.com/capawesome-team/capacitor-firebase/pull/806)): chore(deps): update the Firebase SDK to the latest version

- [`008fbaeb3e50ebf9a3323a7c4bc9f7202c4f3501`](https://github.com/capawesome-team/capacitor-firebase/commit/008fbaeb3e50ebf9a3323a7c4bc9f7202c4f3501) ([#804](https://github.com/capawesome-team/capacitor-firebase/pull/804)): feat: update Facebook Login SDK on iOS and Android to version `18.0.0`

### Minor Changes

- [`0bffff08b661c704a2e22cd024761f1b1599b791`](https://github.com/capawesome-team/capacitor-firebase/commit/0bffff08b661c704a2e22cd024761f1b1599b791) ([#795](https://github.com/capawesome-team/capacitor-firebase/pull/795)): feat: add SPM support

## 6.3.1

### Patch Changes

- [`a1aceb1`](https://github.com/capawesome-team/capacitor-firebase/commit/a1aceb13beb892627e16be3c093b56591ef05832) ([#775](https://github.com/capawesome-team/capacitor-firebase/pull/775)): fix(ios): downgrade the Facebook iOS SDK to 17.1.0

## 6.3.0

### Minor Changes

- [`b57f1ee`](https://github.com/capawesome-team/capacitor-firebase/commit/b57f1ee264f0a614e7284307402cf2293b665913) ([#751](https://github.com/capawesome-team/capacitor-firebase/pull/751)): feat: add `idTokenChange` event listener

* [`72080dd`](https://github.com/capawesome-team/capacitor-firebase/commit/72080dd8d9cb6e730fc83897b49a33f7376b9799) ([#760](https://github.com/capawesome-team/capacitor-firebase/pull/760)): feat(deps): add support for Firebase JS SDK 11

- [`069edf3`](https://github.com/capawesome-team/capacitor-firebase/commit/069edf3340780fa42758ff58ce8291fe80fa231d) ([#768](https://github.com/capawesome-team/capacitor-firebase/pull/768)): feat(ios): update Facebook iOS SDK to `17.4.0`

* [`7af2032`](https://github.com/capawesome-team/capacitor-firebase/commit/7af20327a4096215210e197f91dd6ab018b34b10) ([#741](https://github.com/capawesome-team/capacitor-firebase/pull/741)): feat: add `verifyBeforeUpdateEmail` method

## 6.2.0

### Patch Changes

- [`38fd57c`](https://github.com/capawesome-team/capacitor-firebase/commit/38fd57cd2f8b423d86f44c0df06b771e23bc3f4f) ([#723](https://github.com/capawesome-team/capacitor-firebase/pull/723)): chore(ios): update `GoogleSignIn` pod to version `7.1.0`

* [`5729328`](https://github.com/capawesome-team/capacitor-firebase/commit/5729328f31e4f604e13a4db64ab009e2e469d824) ([#726](https://github.com/capawesome-team/capacitor-firebase/pull/726)): fix(android): explicitly request Google auth token with provided scopes

- [`a780009`](https://github.com/capawesome-team/capacitor-firebase/commit/a78000908c82e4b7520ae92eb6aeb6850429c12e) ([#737](https://github.com/capawesome-team/capacitor-firebase/pull/737)): chore(ios): update Firebase pods to version `11.0`

## 6.1.0

### Minor Changes

- [`638adac`](https://github.com/capawesome-team/capacitor-firebase/commit/638adace9e89105b198efd3bf7c2d0736b005fa7) ([#657](https://github.com/capawesome-team/capacitor-firebase/pull/657)): feat: support `actionCodeSettings` in `sendEmailVerification(...)` and `sendPasswordResetEmail(...)`

* [`e2d6914`](https://github.com/capawesome-team/capacitor-firebase/commit/e2d691406fbe43af0390fb95eeaf48cf28f8f3bc) ([#625](https://github.com/capawesome-team/capacitor-firebase/pull/625)): feat: support OpenID Connect

- [`9cca701`](https://github.com/capawesome-team/capacitor-firebase/commit/9cca7016e0e46452299febff64ba5ef632c23d5e) ([#644](https://github.com/capawesome-team/capacitor-firebase/pull/644)): feat: add `revokeAccessToken(...)` method

### Patch Changes

- [`aa08e71`](https://github.com/capawesome-team/capacitor-firebase/commit/aa08e7110126a7d9ac91976ccd0037d29e83587e) ([#632](https://github.com/capawesome-team/capacitor-firebase/pull/632)): fix(android): `NullPointerException` when `getPendingAuthResult()` is called

* [`f8430f2`](https://github.com/capawesome-team/capacitor-firebase/commit/f8430f2dc4fc915e8cd39689ebc9249015c0fc64) ([#650](https://github.com/capawesome-team/capacitor-firebase/pull/650)): fix(web): `updateProfile(...)` ignored the `photoUrl`

- [`f597638`](https://github.com/capawesome-team/capacitor-firebase/commit/f597638391c41d8990e1e3d5a7fd5a897fe12337) ([#642](https://github.com/capawesome-team/capacitor-firebase/pull/642)): chore(deps): update Firebase iOS SDK to 10.25

## 6.0.0

### Major Changes

- [`4480c16`](https://github.com/capawesome-team/capacitor-firebase/commit/4480c16c6bdbcac6e393bdecafd2d37b669fdda3) ([#586](https://github.com/capawesome-team/capacitor-firebase/pull/586)): chore(deps): update Android SDKs

* [`249ba0a`](https://github.com/capawesome-team/capacitor-firebase/commit/249ba0ab9f28a9cc372c018476a0d49b85b4bb76) ([#612](https://github.com/capawesome-team/capacitor-firebase/pull/612)): chore(deps): update Firebase iOS SDK to `10.24.0`

- [`6703b9d`](https://github.com/capawesome-team/capacitor-firebase/commit/6703b9d8e2e2ee7fb1260f0eac90f02963af0944) ([#594](https://github.com/capawesome-team/capacitor-firebase/pull/594)): chore(deps): update the `firebase` dependency to `10.9.0`

* [`8ad8035`](https://github.com/capawesome-team/capacitor-firebase/commit/8ad8035747761d45254fc75e79de34bfd9fc3421): feat: update to Capacitor 6

### Minor Changes

- [`4d21118`](https://github.com/capawesome-team/capacitor-firebase/commit/4d2111872d1b08e12d7a111d0516912f5f957238) ([#572](https://github.com/capawesome-team/capacitor-firebase/pull/572)): feat(android): support dynamic Firebase config

* [`69e5768`](https://github.com/capawesome-team/capacitor-firebase/commit/69e57682ed71cb3e07aa2d982def960b10b9b320) ([#593](https://github.com/capawesome-team/capacitor-firebase/pull/593)): feat: add `fetchSignInMethodsForEmail(...)` method

### Patch Changes

- [`b91b3a4`](https://github.com/capawesome-team/capacitor-firebase/commit/b91b3a421a3ed1909d015ebcba650c2426d7ce38) ([#613](https://github.com/capawesome-team/capacitor-firebase/pull/613)): fix(web): `authStateChange` listener fires too early

## 5.4.1

### Patch Changes

- [`f0cd1f9`](https://github.com/capawesome-team/capacitor-firebase/commit/f0cd1f970ea967170153667a64acc6e350f0ee46) ([#561](https://github.com/capawesome-team/capacitor-firebase/pull/561)): fix: `authStateChange` event is not fired right after the listener is registered

## 5.4.0

### Minor Changes

- [`ed9e258`](https://github.com/capawesome-team/capacitor-firebase/commit/ed9e2589404b89546e308570e0a0bbdf859848fc) ([#546](https://github.com/capawesome-team/capacitor-firebase/pull/546)): feat(android): update `com.google.firebase:firebase-auth` to version `22.3.1`

* [`07d038a`](https://github.com/capawesome-team/capacitor-firebase/commit/07d038a12660637ca0884e5271fe434ecdd0971e) ([#522](https://github.com/capawesome-team/capacitor-firebase/pull/522)): feat(android): add `timeout` option to `signInWithPhoneNumber(…)`

### Patch Changes

- [`f18c6f0`](https://github.com/capawesome-team/capacitor-firebase/commit/f18c6f0cfd5d3d4eee458c18e49968a1f8804f80) ([#538](https://github.com/capawesome-team/capacitor-firebase/pull/538)): fix(ios): sign-in with oauth provider failed

* [`0e0bc8a`](https://github.com/capawesome-team/capacitor-firebase/commit/0e0bc8af428de0d65c69ce37d13b31eb323f3468) ([#520](https://github.com/capawesome-team/capacitor-firebase/pull/520)): fix(ios): empty verification ID on phone auth

- [`d548176`](https://github.com/capawesome-team/capacitor-firebase/commit/d54817690550394a5a094a40b89e008243aafda8) ([#512](https://github.com/capawesome-team/capacitor-firebase/pull/512)): fix: `null` values were not returned

## 5.3.0

### Patch Changes

- [`1b135c5`](https://github.com/capawesome-team/capacitor-firebase/commit/1b135c5153278ecf3110e7270f0952f41fc60fb2) ([#482](https://github.com/capawesome-team/capacitor-firebase/pull/482)): fix(ios): `displayName` was not returned on Apple sign-in

* [`65a9d0c`](https://github.com/capawesome-team/capacitor-firebase/commit/65a9d0c0eca055ef56024b76fdf0058568e7c38b): fix(ios): set correct return type for `removeAllListeners()`

## 5.2.0

### Minor Changes

- [`16a802c`](https://github.com/capawesome-team/capacitor-firebase/commit/16a802c15be9de41aef8e9947a0ad151a73a6290) ([#288](https://github.com/capawesome-team/capacitor-firebase/pull/288)): feat(web): support `signInWithPhoneNumber` and `linkWithPhoneNumber`

* [`2ea241b`](https://github.com/capawesome-team/capacitor-firebase/commit/2ea241b767960b2d29d3e5bdaa7e2a1c46d42a5b) ([#440](https://github.com/capawesome-team/capacitor-firebase/pull/440)): feat(ios): support `scopes` option for Google Sign-In

- [`f50db1c`](https://github.com/capawesome-team/capacitor-firebase/commit/f50db1c7b06ad543a1a42b43221c03656c06fe19) ([#432](https://github.com/capawesome-team/capacitor-firebase/pull/432)): feat: expose `providerData` and `metadata` property

* [`642f508`](https://github.com/capawesome-team/capacitor-firebase/commit/642f508d79a0577946757b6fb099148321e25dcb) ([#430](https://github.com/capawesome-team/capacitor-firebase/pull/430)): feat(web): add method `setPersistence`

- [`12e0052`](https://github.com/capawesome-team/capacitor-firebase/commit/12e00524a728f2544388d2eb72719bb5d01fae73) ([#442](https://github.com/capawesome-team/capacitor-firebase/pull/442)): feat: support `forceCodeForRefreshToken` for Google Sign-in

* [`f845e3c`](https://github.com/capawesome-team/capacitor-firebase/commit/f845e3c590640119f00cadb804ebac971c8f102a) ([#447](https://github.com/capawesome-team/capacitor-firebase/pull/447)): feat(android): update `com.google.firebase:firebase-auth` to version `22.1.2`

- [`36bd3f7`](https://github.com/capawesome-team/capacitor-firebase/commit/36bd3f7c4a5df19ba9e3a8f7b3347dbcc7765c70) ([#461](https://github.com/capawesome-team/capacitor-firebase/pull/461)): feat(web): add option `scheme` to `useEmulator` method

## 5.1.0

### Minor Changes

- [`98627e6`](https://github.com/capawesome-team/capacitor-firebase/commit/98627e60aeb669ce04641cf9bec3490e52ae27c0) ([#403](https://github.com/capawesome-team/capacitor-firebase/pull/403)): feat: support Firebase JS SDK 10

## 5.0.1

## 5.0.0

### Major Changes

- [`fe89573`](https://github.com/capawesome-team/capacitor-firebase/commit/fe89573f7c02c12d9f82c8531b3a513e32a21602) ([#357](https://github.com/capawesome-team/capacitor-firebase/pull/357)): refactor(android)!: use `getMessage` instead of `getLocalizedMessage`

* [`9711b58`](https://github.com/capawesome-team/capacitor-firebase/commit/9711b58f077fec08c33c951e685ecf7346258cba) ([#355](https://github.com/capawesome-team/capacitor-firebase/pull/355)): feat!: update to Capacitor 5

- [`b98f476`](https://github.com/capawesome-team/capacitor-firebase/commit/b98f4764623f9edabf3ba9e7e03ae63880103241) ([#366](https://github.com/capawesome-team/capacitor-firebase/pull/366)): feat!: update native SDKs

* [`41cf39f`](https://github.com/capawesome-team/capacitor-firebase/commit/41cf39f8a75638e056590f0ac5476cb840a0a219) ([#358](https://github.com/capawesome-team/capacitor-firebase/pull/358)): refactor!: remove deprecated params

### Minor Changes

- [`75e6fd1`](https://github.com/capawesome-team/capacitor-firebase/commit/75e6fd15eff8356106966f5040db9628877688b5) ([#374](https://github.com/capawesome-team/capacitor-firebase/pull/374)): feat(android): support Android 13+ notification permission

* [`3c8b54f`](https://github.com/capawesome-team/capacitor-firebase/commit/3c8b54fca109229490402bc2a4a1a980d53cb927) ([#372](https://github.com/capawesome-team/capacitor-firebase/pull/372)): feat: provide error code

- [`6951f3b`](https://github.com/capawesome-team/capacitor-firebase/commit/6951f3b4468df433655b69b3ab6b9c275f9a27f4) ([#368](https://github.com/capawesome-team/capacitor-firebase/pull/368)): feat(ios): pass `fullName` (Apple) to Firebase iOS SDK

### Patch Changes

- [`ea4ad06`](https://github.com/capawesome-team/capacitor-firebase/commit/ea4ad06f8f28efc4763fcf119076b9bb10708c76) ([#344](https://github.com/capawesome-team/capacitor-firebase/pull/344)): fix: improve error logging

## 1.4.0

### Patch Changes

- [`2d51ffc`](https://github.com/capawesome-team/capacitor-firebase/commit/2d51ffc13bc2a93c9170172ebd7c5cc4e28ba1cf) ([#305](https://github.com/capawesome-team/capacitor-firebase/pull/305)): fix(android): `NullPointerException` on Google Sign-In

## 1.3.0

### Minor Changes

- [`8b27765`](https://github.com/capawesome-team/capacitor-firebase/commit/8b277658ae511fcfd03de9ba35ff291434641ae9) ([#285](https://github.com/capawesome-team/capacitor-firebase/pull/285)): feat: add `reload` method (by @trancee)

* [`9024eef`](https://github.com/capawesome-team/capacitor-firebase/commit/9024eef856dbd25b2b6459e4b6bcee104ca89755) ([#238](https://github.com/capawesome-team/capacitor-firebase/pull/238)): feat(web): support sign-in with redirect

- [`fcb0f25`](https://github.com/capawesome-team/capacitor-firebase/commit/fcb0f2586ec89c6902488a5f4f183114fc15556b) ([#235](https://github.com/capawesome-team/capacitor-firebase/pull/235)): feat(ios): support Game Center Sign-In

* [`57a7497`](https://github.com/capawesome-team/capacitor-firebase/commit/57a74971cd8daf2175f09b780dc40d11872cc8f5) ([#273](https://github.com/capawesome-team/capacitor-firebase/pull/273)): feat(android): resend sms verification code

- [`5665835`](https://github.com/capawesome-team/capacitor-firebase/commit/566583561a10f803002639b7b477c6d00cf8dedf) ([#265](https://github.com/capawesome-team/capacitor-firebase/pull/265)): feat: update all native SDKs

* [`4c00b61`](https://github.com/capawesome-team/capacitor-firebase/commit/4c00b6158282d3061337b2f007b344a89cadfed0) ([#272](https://github.com/capawesome-team/capacitor-firebase/pull/272)): feat(android): provide the auto-retrieved SMS verification code

- [`46864df`](https://github.com/capawesome-team/capacitor-firebase/commit/46864dfc7d5de654321dcdaf3a2f3f36949d86db) ([#282](https://github.com/capawesome-team/capacitor-firebase/pull/282)): feat: add `deleteUser` method (by @trancee)

* [`d31f96f`](https://github.com/capawesome-team/capacitor-firebase/commit/d31f96f7f6f4637287a43cf006523b63af9bdb20) ([#277](https://github.com/capawesome-team/capacitor-firebase/pull/277)): feat: add `updateProfile` method (by @trancee)

### Patch Changes

- [`5c1b40b`](https://github.com/capawesome-team/capacitor-firebase/commit/5c1b40b1c840df4fa43b60d38fde8d88cc21d993) ([#246](https://github.com/capawesome-team/capacitor-firebase/pull/246)): fix(android): update Facebook Login SDK

## 1.2.0

### Minor Changes

- [`29ac6cc`](https://github.com/capawesome-team/capacitor-firebase/commit/29ac6cc792ee4b014510cc631a754e4a2f46aa1a) ([#213](https://github.com/capawesome-team/capacitor-firebase/pull/213)): feat(ios): return `authorizationCode` on Apple Sign-In

### Patch Changes

- [`57ae209`](https://github.com/capawesome-team/capacitor-firebase/commit/57ae20929918bab6915536843109424a80495b42) ([#214](https://github.com/capawesome-team/capacitor-firebase/pull/214)): fix(ios): `getConfigValue` is deprecated

## 1.1.0

### Minor Changes

- [`ad7c25b`](https://github.com/capawesome-team/capacitor-firebase/commit/ad7c25b906860028a0bf832f6d3f8d2b7ef5f114) ([#172](https://github.com/capawesome-team/capacitor-firebase/pull/172)): feat: support Email Link Authentication (by @trancee)

* [`e06605d`](https://github.com/capawesome-team/capacitor-firebase/commit/e06605dc113b4be051275f17439afc62131ab52f) ([#181](https://github.com/capawesome-team/capacitor-firebase/pull/181)): feat: add `tenantId` support

- [`590545d`](https://github.com/capawesome-team/capacitor-firebase/commit/590545db537a7f0f327217bc08e3343681d693b0) ([#194](https://github.com/capawesome-team/capacitor-firebase/pull/194)): feat: overwrite `skipNativeAuth` configuration option

* [`39830a1`](https://github.com/capawesome-team/capacitor-firebase/commit/39830a1a25263798c357eacff5dc4066a7ca2502) ([#176](https://github.com/capawesome-team/capacitor-firebase/pull/176)): feat: add Sign-In Anonymously (by @trancee)

### Patch Changes

- [`cf0d83d`](https://github.com/capawesome-team/capacitor-firebase/commit/cf0d83dc59100555055fee95f098ece839ed76ab) ([#192](https://github.com/capawesome-team/capacitor-firebase/pull/192)): fix(ios): `displayName` is missing when signing in with Apple using `skipNativeAuth`

* [`c1fb022`](https://github.com/capawesome-team/capacitor-firebase/commit/c1fb0220a4e633c2606c5a55daad164bf154188a) ([#196](https://github.com/capawesome-team/capacitor-firebase/pull/196)): fix(android): `serverAuthCode` is null on Play Games Sign-In

- [`eeeecae`](https://github.com/capawesome-team/capacitor-firebase/commit/eeeecaeb8a463bf51bcd535d2be488e554e23a7d) ([#186](https://github.com/capawesome-team/capacitor-firebase/pull/186)): fix: retain `authStateChangeEvent` until consumed on Android and iOS

## 1.0.0

### Major Changes

- [`83debcf`](https://github.com/capawesome-team/capacitor-firebase/commit/83debcf02500c6a9ecb363eb30b918ace7b416a5) ([#168](https://github.com/capawesome-team/capacitor-firebase/pull/168)): feat!: update to Capacitor 4 (**BREAKING CHANGES**: see [`BREAKING.md`](https://github.com/capawesome-team/capacitor-firebase#breaking-changes))

### Minor Changes

- [`20448e7`](https://github.com/capawesome-team/capacitor-firebase/commit/20448e7beb9c401ac2d36436035b33169105f0e4) ([#151](https://github.com/capawesome-team/capacitor-firebase/pull/151)): fix!: no more providers are loaded by default (**BREAKING CHANGES**: see [`BREAKING.md`](https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/BREAKING.md))

## 0.5.1

### Patch Changes

- [`e3ab129`](https://github.com/capawesome-team/capacitor-firebase/commit/e3ab1295b5d4a1cde0d7345a9b8e6552b1be7a5c) ([#157](https://github.com/capawesome-team/capacitor-firebase/pull/157)): fix(web): `customParameters` is not applied

* [`4a0e4df`](https://github.com/capawesome-team/capacitor-firebase/commit/4a0e4df7275dfa080d09ac4b3fa9e43448158f9f) ([#147](https://github.com/capawesome-team/capacitor-firebase/pull/147)): fix(android): `NullPointerException`

- [`2165073`](https://github.com/capawesome-team/capacitor-firebase/commit/2165073ec68d29706dd6bec19a04540b9aaaee38) ([#154](https://github.com/capawesome-team/capacitor-firebase/pull/154)): feat: expose `AdditionalUserInfo`

* [`c8543f6`](https://github.com/capawesome-team/capacitor-firebase/commit/c8543f6985983f9a96dc6d435429af20841c539b) ([#149](https://github.com/capawesome-team/capacitor-firebase/pull/149)): fix(android): catch all native errors and pass to the webview

## 0.5.0

### Minor Changes

- [`e72bb95`](https://github.com/capawesome-team/capacitor-firebase/commit/e72bb9526ff7a18092dbe53bac8fb03eec314be4): feat(ios)!: update Facebook iOS SDK to `13.2.0` (**BREAKING CHANGES**: see [`BREAKING.md`](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication/BREAKING.md))

## 0.3.1

### Patch Changes

- [`5da5fbf`](https://github.com/robingenz/capacitor-firebase/commit/5da5fbfaec6305d06f6909261cf46546331414fa) ([#107](https://github.com/robingenz/capacitor-firebase/pull/107)): fix(ios): provide access token for Twitter

* [`e4a4787`](https://github.com/robingenz/capacitor-firebase/commit/e4a47873adab9ceb6dd1800c8bfcf41f8060ab4e) ([#80](https://github.com/robingenz/capacitor-firebase/pull/80)): feat: support OAuth 2.0 scopes

- [`b7e1e6e`](https://github.com/robingenz/capacitor-firebase/commit/b7e1e6eb74986577082f574e1bcc05500283f68f) ([#98](https://github.com/robingenz/capacitor-firebase/pull/98)): feat(android): provide access token for Google

* [`35d4407`](https://github.com/robingenz/capacitor-firebase/commit/35d44079258e5abdd7c631e2ca801b32544173d3) ([#95](https://github.com/robingenz/capacitor-firebase/pull/95)): chore(deps): update native dependencies

## 0.3.0

### Patch Changes

- [`935744d`](https://github.com/robingenz/capacitor-firebase/commit/935744df7c0a6703606048db75e71d2b00132c57) ([#84](https://github.com/robingenz/capacitor-firebase/pull/84)): fix(web): apply `forceRefresh` option in the `getIdToken` method

## 0.2.2

### Patch Changes

- [`8da4212`](https://github.com/robingenz/capacitor-firebase/commit/8da42124fa4ea1656e6db247952cb84718e60e31) ([#59](https://github.com/robingenz/capacitor-firebase/pull/59)): feat: password authentication

* [`412e357`](https://github.com/robingenz/capacitor-firebase/commit/412e35796e3fd60167318785e4d06a07dee31dfe) ([#71](https://github.com/robingenz/capacitor-firebase/pull/71)): fix(ios): `removeAllListeners` method not found

- [`5648977`](https://github.com/robingenz/capacitor-firebase/commit/564897735718a9b5e559532c59c6a3c1e734e10f) ([#79](https://github.com/robingenz/capacitor-firebase/pull/79)): fix: `getIdToken` causes app crash if no user is signed in

## 0.2.1

### Patch Changes

- [`5c0f381`](https://github.com/robingenz/capacitor-firebase/commit/5c0f38164514dd38212cae8c4c7f28cfb8905416) ([#55](https://github.com/robingenz/capacitor-firebase/pull/55)): feat: provide access tokens for Google and Facebook

* [`243011c`](https://github.com/robingenz/capacitor-firebase/commit/243011cd2ef6960c74800c6539eb735bcf15fc8b) ([#58](https://github.com/robingenz/capacitor-firebase/pull/58)): fix: `accessToken` was returned as `idToken`

## 0.2.0

### Minor Changes

- [`ca9f3df`](https://github.com/robingenz/capacitor-firebase/commit/ca9f3df36e4d6e2446e7d70a1a8612d8f4941359) ([#22](https://github.com/robingenz/capacitor-firebase/pull/22)): feat: support Firebase Emulator

## 0.1.1

### Patch Changes

- [`51fd609`](https://github.com/robingenz/capacitor-firebase/commit/51fd6092d0e47242f797be9209cc7f33ccc39e93) ([#17](https://github.com/robingenz/capacitor-firebase/pull/17)): fix(android): build error

## 0.1.0

### Minor Changes

- [`be27343`](https://github.com/robingenz/capacitor-firebase/commit/be273433922cf71e55784d580fe0af4f95576c3c) ([#16](https://github.com/robingenz/capacitor-firebase/pull/16)): Initial release 🎉
