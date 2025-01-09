import { Capacitor } from '@capacitor/core';
import type { DocumentData } from 'firebase/firestore';
import { Timestamp as OriginalTimestamp } from 'firebase/firestore';

import type {
  DocumentSnapshot,
  FirebaseFirestorePlugin,
  WriteBatchOptions,
} from './definitions';
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
    get(target, prop, receiver) {
      const getProperty = Reflect.get(target, prop, receiver);

      // Get document, collection or collection group
      if (
        prop === 'getDocument' ||
        prop === 'getCollection' ||
        prop === 'getCollectionGroup'
      ) {
        return async function (options: any): Promise<any> {
          return parseResult(await getProperty(options));
        };
      }

      // Add, update, set document
      if (
        prop === 'addDocument' ||
        prop === 'setDocument' ||
        prop === 'updateDocument'
      ) {
        return async function (options: any): Promise<any> {
          return getProperty(formatOptionsData(options));
        };
      }

      // Write batch
      if (prop === 'writeBatch') {
        return async function (options: WriteBatchOptions): Promise<void> {
          options.operations = options.operations.map(operation =>
            formatOptionsData(operation),
          );
          return getProperty(options);
        };
      }

      // Listener document, collection, collection group
      if (
        prop === 'addDocumentSnapshotListener' ||
        prop === 'addCollectionSnapshotListener' ||
        prop === 'addCollectionGroupSnapshotListener'
      ) {
        return async function (options: any, callback: any): Promise<any> {
          return getProperty(options, (ev: any, err: any) =>
            callback(ev ? parseResult(ev as any) : ev, err),
          );
        };
      }

      return getProperty;
    },
  });
}

/**
 * Format the options data to be passed to the native plugin
 * @param options The options to format
 * @returns The formated options
 */
function formatOptionsData<T extends { data?: DocumentData }>(options: T): T {
  if (Capacitor.isNativePlatform() && options.data) {
    // Force the data to be serialized in JSON
    options.data = JSON.parse(JSON.stringify(options.data));
  }
  return options;
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
    if (field[FIRESTORE_FIELD_TYPE] === 'timestamp') {
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
