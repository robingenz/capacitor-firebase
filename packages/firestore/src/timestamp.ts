import { Timestamp as OriginalTimestamp } from 'firebase/firestore';

import type { CustomField } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';

/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 *
 * @since 7.0.0
 */
export class Timestamp extends OriginalTimestamp {
  /**
   * Creates a new timestamp from a JS SDK firestore timestamp.
   *
   * @param timestamp The Firestore timestamp.
   * @returns A new `Timestamp` representing the same point in time as the given timestamp.
   */
  public static fromOriginalTimestamp(timestamp: OriginalTimestamp): Timestamp {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds);
  }

  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @since 7.0.0
   * @returns a new timestamp representing the current date.
   */
  static now(): Timestamp {
    return Timestamp.fromOriginalTimestamp(OriginalTimestamp.now());
  }

  /**
   * Creates a new timestamp from the given date.
   *
   * @since 7.0.0
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(date: Date): Timestamp {
    return Timestamp.fromOriginalTimestamp(OriginalTimestamp.fromDate(date));
  }

  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @since 7.0.0
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(milliseconds: number): Timestamp {
    return Timestamp.fromOriginalTimestamp(
      OriginalTimestamp.fromMillis(milliseconds),
    );
  }

  /**
   * Returns a JSON-serializable representation of this `Timestamp`.
   *
   * @since 7.0.0
   */
  public toJSON(): any {
    return {
      [FIRESTORE_FIELD_TYPE]: 'timestamp',
      [FIRESTORE_FIELD_VALUE]: {
        seconds: this.seconds,
        nanoseconds: this.nanoseconds,
      },
    } as CustomField;
  }
}
