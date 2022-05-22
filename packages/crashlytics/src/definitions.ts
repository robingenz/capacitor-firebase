export interface FirebaseCrashlyticsPlugin {
  /**
   * Forces a crash to test the implementation.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  crash(options: CrashOptions): Promise<void>;
  /**
   * Sets a custom key and value that is associated with subsequent fatal and non-fatal reports.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  setCustomKey(options: SetCustomKeyOptions): Promise<void>;
  /**
   * Sets a user ID (identifier) that is associated with subsequent fatal and non-fatal reports.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  setUserId(options: SetUserIdOptions): Promise<void>;
  /**
   * Adds a custom log message that is sent with your crash data to give yourself more context for the events leading up to a crash.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  log(options: LogOptions): Promise<void>;
  /**
   * Enables/disables automatic data collection.
   * The value does not apply until the next run of the app.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  setEnabled(options: SetEnabledOptions): Promise<void>;
  /**
   * Returns whether or not automatic data collection is enabled.
   *
   * Only available for iOS.
   *
   * @since 0.1.0
   */
  isEnabled(): Promise<IsEnabledResult>;
  /**
   * Returns whether the app crashed during the previous execution.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  didCrashOnPreviousExecution(): Promise<DidCrashOnPreviousExecutionResult>;
  /**
   * Uploads any unsent reports to Crashlytics.
   * When automatic data collection is enabled, Crashlytics automatically uploads reports at startup.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  sendUnsentReports(): Promise<void>;
  /**
   * Deletes any unsent reports on the device.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  deleteUnsentReports(): Promise<void>;
  /**
   * Records a non-fatal report to send to Crashlytics.
   *
   * Only available for Android and iOS.
   *
   * @since 0.1.0
   */
  recordException(options: RecordExceptionOptions): Promise<void>;
}

/**
 * @since 0.1.0
 */
export interface CrashOptions {
  /**
   * @since 0.1.0
   */
  message: string;
}

/**
 * @since 0.1.0
 */
export interface SetCustomKeyOptions {
  /**
   * @since 0.1.0
   */
  key: string;
  /**
   * @since 0.1.0
   */
  value: string | number | boolean;
  /**
   * @since 0.1.0
   */
  type: 'string' | 'long' | 'double' | 'boolean' | 'int' | 'float';
}

/**
 * @since 0.1.0
 */
export interface SetUserIdOptions {
  /**
   * @since 0.1.0
   */
  userId: string;
}

/**
 * @since 0.1.0
 */
export interface LogOptions {
  /**
   * @since 0.1.0
   */
  message: string;
}

/**
 * @since 0.1.0
 */
export interface SetEnabledOptions {
  /**
   * @since 0.1.0
   */
  enabled: boolean;
}

/**
 * @since 0.1.0
 */
export interface IsEnabledResult {
  /**
   * @since 0.1.0
   */
  enabled: boolean;
}

/**
 * @since 0.1.0
 */
export interface DidCrashOnPreviousExecutionResult {
  /**
   * @since 0.1.0
   */
  crashed: boolean;
}

/**
 * @since 0.1.0
 */
export interface RecordExceptionOptions {
  /**
   * @since 0.1.0
   */
  message: string;
  /**
   * Error code within a specific error domain.
   *
   * Only available for iOS.
   *
   * @since 0.1.0
   */
  code?: number;
  /**
   * A string containing the error domain.
   *
   * Only available for iOS.
   *
   * @since 0.1.0
   */
  domain?: string;
}
