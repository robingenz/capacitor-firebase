import { Timestamp as OriginalTimestamp } from 'firebase/firestore';

import type { CustomField } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';

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

  static now(): Timestamp {
    return Timestamp.fromOriginalTimestamp(OriginalTimestamp.now());
  }

  static fromDate(date: Date): Timestamp {
    return Timestamp.fromOriginalTimestamp(OriginalTimestamp.fromDate(date));
  }

  static fromMillis(milliseconds: number): Timestamp {
    return Timestamp.fromOriginalTimestamp(
      OriginalTimestamp.fromMillis(milliseconds),
    );
  }

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
