import type { FieldValue as OriginalFieldValue } from 'firebase/firestore';
import { serverTimestamp as originalServerTimestamp } from 'firebase/firestore';

import type { CustomField } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';

type FieldValue = OriginalFieldValue & { toJSON?: () => any };

export function serverTimestamp(
  ...args: Parameters<typeof originalServerTimestamp>
): OriginalFieldValue {
  const fieldValue: FieldValue = originalServerTimestamp(...args);
  fieldValue.toJSON = () =>
    ({
      [FIRESTORE_FIELD_TYPE]: 'fieldvalue',
      [FIRESTORE_FIELD_VALUE]: {
        method: 'serverTimestamp',
      },
    } as CustomField);
  return fieldValue;
}
