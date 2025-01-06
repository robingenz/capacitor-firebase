import { Timestamp as OriginalTimestamp } from 'firebase/firestore';

import type { DocumentSnapshot, FirebaseFirestorePlugin } from './definitions';
import type { CustomField, CustomTimestamp } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';
import { Timestamp } from './timestamp';

/**
 * Apply a proxy on the plugin to manage document data parsing
 * @param plugin The capacitor plugin
 * @returns A proxied plugin that manage parsing
 */
export function getClientPlugin(
  plugin: FirebaseFirestorePlugin,
): FirebaseFirestorePlugin {
  return new Proxy(plugin, {
    get(target, prop) {
      // Get document, collection or collection group
      if (
        prop === 'getDocument' ||
        prop === 'getCollection' ||
        prop === 'getCollectionGroup'
      ) {
        return async function (options: any): Promise<any> {
          return parseResult(await (target[prop] as any)(options));
        };
      }

      // Listener document, collection, collection group
      if (
        prop === 'addDocumentSnapshotListener' ||
        prop === 'addCollectionSnapshotListener' ||
        prop === 'addCollectionGroupSnapshotListener'
      ) {
        return async function (options: any, callback: any): Promise<any> {
          return (target[prop] as any)(options, (ev: any, err: any) =>
            callback(ev ? parseResult(ev as any) : ev, err),
          );
        };
      }

      return (target as any)[prop];
    },
  });
}

/**
 * Parse a received result
 * @param res The result of a read method
 * @returns The parsed result
 */
function parseResult<
  T,
  U extends {
    snapshot?: DocumentSnapshot<T>;
    snapshots?: DocumentSnapshot<T>[];
  },
>(res: U): U {
  if (res?.snapshot?.data) {
    res.snapshot.data = parseResultDocumentData(res.snapshot.data);
  }
  if (res?.snapshots) {
    res.snapshots.map(s => parseResultDocumentData(s));
  }
  return res;
}

/**
 * Parse the document data result to convert some field values
 * @param data The document data to parse
 * @returns
 */
function parseResultDocumentData(data: any): any {
  if (!data) {
    return data;
  }

  // On web, convert the firebase Timestamp into the custom one
  if (data instanceof OriginalTimestamp) {
    return Timestamp.fromOriginalTimestamp(data);
  }

  // On native, we receive the special JSON format to convert
  if (data[FIRESTORE_FIELD_TYPE]) {
    const field: CustomField = data;
    switch (field[FIRESTORE_FIELD_TYPE]) {
      case 'timestamp':
        return new Timestamp(
          (field as CustomTimestamp)[FIRESTORE_FIELD_VALUE].seconds,
          (field as CustomTimestamp)[FIRESTORE_FIELD_VALUE].nanoseconds,
        );
    }
  }

  if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      data[key] = parseResultDocumentData(data[key]);
    });
  }

  return data;
}
