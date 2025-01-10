import type { FieldValue as OriginalFieldValue } from 'firebase/firestore';
import {
  serverTimestamp as originalServerTimestamp,
  arrayRemove as originalArrayRemove,
  arrayUnion as originalArrayUnion,
  deleteField as originalDeleteField,
  increment as originalIncrement,
} from 'firebase/firestore';

import type { CustomField } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';

type FieldValue = OriginalFieldValue & { toJSON?: () => any };

/**
 * Returns a special value that can be used with `setDocument()` or
 * `updateDocument()` that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @since 7.0.0
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDocument()` or
 * `updateDocument()`
 */
export function arrayRemove(
  ...args: Parameters<typeof originalArrayRemove>
): OriginalFieldValue {
  return getFieldValue('arrayRemove', originalArrayRemove, args);
}

/**
 * Returns a special value that can be used with `setDocument()` or
 * `updateDocument()` that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @since 7.0.0
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDocument()` or
 * `updateDocument()`.
 */
export function arrayUnion(
  ...args: Parameters<typeof originalArrayUnion>
): OriginalFieldValue {
  return getFieldValue('arrayUnion', originalArrayUnion, args);
}

/**
 * Returns a sentinel for use with `updateDocument()` or
 * `setDocument()` with `{merge: true}` to mark a field for deletion.
 *
 * @since 7.0.0
 */
export function deleteField(
  ...args: Parameters<typeof originalDeleteField>
): OriginalFieldValue {
  return getFieldValue('deleteField', originalDeleteField, args);
}

/**
 * Returns a special value that can be used with `setDocument()` or
 * `updateDocument()` that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @since 7.0.0
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDocument()` or
 * `updateDocument()`
 */
export function increment(
  ...args: Parameters<typeof originalIncrement>
): OriginalFieldValue {
  return getFieldValue('increment', originalIncrement, args);
}

/**
 * Returns a sentinel used with `setDocument()` or `updateDocument()` to
 * include a server-generated timestamp in the written data.
 *
 * @since 7.0.0
 */
export function serverTimestamp(
  ...args: Parameters<typeof originalServerTimestamp>
): OriginalFieldValue {
  return getFieldValue('serverTimestamp', originalServerTimestamp, args);
}

/**
 * Build the custom FieldVallue
 */
function getFieldValue(
  fieldKey: string,
  method: (...args: any) => FieldValue,
  args: any[],
): OriginalFieldValue {
  const fieldValue: FieldValue = method(...args);
  fieldValue.toJSON = () =>
    ({
      [FIRESTORE_FIELD_TYPE]: 'fieldvalue',
      [FIRESTORE_FIELD_VALUE]: {
        method: fieldKey,
        args,
      },
    } as CustomField);
  return fieldValue;
}
