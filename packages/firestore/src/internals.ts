/**
 * The custom field type attribute key
 */
export const FIRESTORE_FIELD_TYPE = '_capacitorFirestoreFieldType';

/**
 * The custom field value attribute key
 */
export const FIRESTORE_FIELD_VALUE = '_capacitorFirestoreFieldValue';

/**
 * A firestore document data custom field
 * Used to serialize the special Firestore fields into JSON
 */
export type CustomField =
  | {
      [FIRESTORE_FIELD_TYPE]: 'fieldvalue';
      [FIRESTORE_FIELD_VALUE]: {
        method: string;
      };
    }
  | {
      [FIRESTORE_FIELD_TYPE]: 'timestamp';
      [FIRESTORE_FIELD_VALUE]: {
        seconds: number;
        nanoseconds: number;
      };
    };
