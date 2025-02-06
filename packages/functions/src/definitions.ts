export interface FirebaseFunctionsPlugin {
  /**
   * Call a callable function by name.
   *
   * @since 6.1.0
   */
  callByName<RequestData = unknown, ResponseData = unknown>(
    options: CallByNameOptions<RequestData>,
  ): Promise<CallByNameResult<ResponseData>>;
  /**
   * Call a callable function by URL.
   *
   * @since 6.1.0
   */
  callByUrl<RequestData = unknown, ResponseData = unknown>(
    options: CallByUrlOptions<RequestData>,
  ): Promise<CallByUrlResult<ResponseData>>;
  /**
   * Instrument your app to talk to the Cloud Functions emulator.
   *
   * On Android, the cleartext traffic must be allowed. On the Capacitor configuration:
   * ```
   * {
   *   server: {
   *     cleartext: true
   *   }
   * }
   * ```
   * **The cleartext traffic is not intended for use in production.**
   *
   * @since 6.1.0
   */
  useEmulator(options: UseEmulatorOptions): Promise<void>;
}

/**
 * @since 6.1.0
 */
export interface CallByNameOptions<RequestData = unknown>
  extends CallOptions<RequestData> {
  /**
   * The name of the callable function.
   *
   * @example 'myFunction'
   * @since 6.1.0
   */
  name: string;
  /**
   * The region of the callable function.
   *
   * @example 'us-central1'
   * @since 6.1.0
   */
  region?: string;
}

/**
 * @since 6.1.0
 */
export type CallByNameResult<ResponseData = unknown> = CallResult<ResponseData>;

/**
 * @since 6.1.0
 */
export interface CallByUrlOptions<RequestData = unknown>
  extends CallOptions<RequestData> {
  /**
   * The URL of the callable function.
   *
   * @example 'https://us-central1-my-project.cloudfunctions.net/myFunction'
   * @since 6.1.0
   */
  url: string;
}

/**
 * @since 6.1.0
 */
export type CallByUrlResult<ResponseData = unknown> = CallResult<ResponseData>;

/**
 * @since 6.1.0
 */
export interface CallOptions<RequestData = unknown> {
  /**
   * The data to pass to the callable function.
   *
   * @since 6.1.0
   */
  data?: RequestData | null;

  /**
   * Time in milliseconds after which to cancel if there is no response. Default is 70000.
   */
  timeout?: number;
}

/**
 * @since 6.1.0
 */
export interface CallResult<ResponseData = unknown> {
  /**
   * The result of the callable function.
   *
   * @since 6.1.0
   */
  data: ResponseData;
}

/**
 * @since 6.1.0
 */
export interface UseEmulatorOptions {
  /**
   * The emulator host without any port or scheme.
   *
   * Note when using a Android Emulator device: 10.0.2.2 is the special IP address to connect to the 'localhost' of the host computer.
   *
   * @since 6.1.0
   * @example "127.0.0.1"
   */
  host: string;
  /**
   * The emulator port.
   *
   * @since 6.1.0
   * @default 5001
   * @example 5001
   */
  port?: number;
  /**
   * The region the callable functions are located in or a custom domain hosting the callable functions.
   *
   * @example 'us-central1'
   * @example 'https://mydomain.com'
   */
  regionOrCustomDomain?: string;
}
