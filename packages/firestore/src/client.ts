import { Capacitor } from '@capacitor/core';
import { Timestamp as OriginalTimestamp } from 'firebase/firestore';

import type {
  AddCollectionGroupSnapshotListenerCallback,
  AddCollectionGroupSnapshotListenerOptions,
  AddCollectionSnapshotListenerCallback,
  AddCollectionSnapshotListenerOptions,
  AddDocumentOptions,
  AddDocumentResult,
  AddDocumentSnapshotListenerCallback,
  AddDocumentSnapshotListenerOptions,
  CallbackId,
  DeleteDocumentOptions,
  DocumentData,
  FirebaseFirestorePlugin,
  GetCollectionGroupOptions,
  GetCollectionGroupResult,
  GetCollectionOptions,
  GetCollectionResult,
  GetDocumentOptions,
  GetDocumentResult,
  RemoveSnapshotListenerOptions,
  SetDocumentOptions,
  UpdateDocumentOptions,
  UseEmulatorOptions,
  WriteBatchOptions,
} from './definitions';
import type { CustomField, CustomTimestamp } from './internals';
import { FIRESTORE_FIELD_TYPE, FIRESTORE_FIELD_VALUE } from './internals';
import { Timestamp } from './timestamp';

/**
 * The plugin client that manage all the data parsing / format between the web and the native platform
 */
export class FirebaseFirestoreClient implements FirebaseFirestorePlugin {
  private readonly plugin: FirebaseFirestorePlugin;

  constructor(plugin: FirebaseFirestorePlugin) {
    this.plugin = plugin;
  }

  addDocument(options: AddDocumentOptions): Promise<AddDocumentResult> {
    return this.plugin.addDocument(formatOptionsData(options));
  }
  setDocument(options: SetDocumentOptions): Promise<void> {
    return this.plugin.setDocument(formatOptionsData(options));
  }
  async getDocument<T extends DocumentData = DocumentData>(
    options: GetDocumentOptions,
  ): Promise<GetDocumentResult<T>> {
    return parseResult(await this.plugin.getDocument<T>(options));
  }
  updateDocument(options: UpdateDocumentOptions): Promise<void> {
    return this.plugin.updateDocument(formatOptionsData(options));
  }
  deleteDocument(options: DeleteDocumentOptions): Promise<void> {
    return this.plugin.deleteDocument(options);
  }
  writeBatch(options: WriteBatchOptions): Promise<void> {
    return this.plugin.writeBatch({
      ...options,
      operations: options.operations.map(operation =>
        formatOptionsData(operation),
      ),
    });
  }
  async getCollection<T extends DocumentData = DocumentData>(
    options: GetCollectionOptions,
  ): Promise<GetCollectionResult<T>> {
    return parseResult(await this.plugin.getCollection<T>(options));
  }
  async getCollectionGroup<T extends DocumentData = DocumentData>(
    options: GetCollectionGroupOptions,
  ): Promise<GetCollectionGroupResult<T>> {
    return parseResult(await this.plugin.getCollectionGroup<T>(options));
  }
  clearPersistence(): Promise<void> {
    return this.plugin.clearPersistence();
  }
  enableNetwork(): Promise<void> {
    return this.plugin.enableNetwork();
  }
  disableNetwork(): Promise<void> {
    return this.plugin.disableNetwork();
  }
  useEmulator(options: UseEmulatorOptions): Promise<void> {
    return this.plugin.useEmulator(options);
  }
  addDocumentSnapshotListener<T extends DocumentData = DocumentData>(
    options: AddDocumentSnapshotListenerOptions,
    callback: AddDocumentSnapshotListenerCallback<T>,
  ): Promise<CallbackId> {
    return this.plugin.addDocumentSnapshotListener<T>(options, (ev, err) =>
      callback(parseResult(ev), err),
    );
  }
  addCollectionSnapshotListener<T extends DocumentData = DocumentData>(
    options: AddCollectionSnapshotListenerOptions,
    callback: AddCollectionSnapshotListenerCallback<T>,
  ): Promise<CallbackId> {
    return this.plugin.addCollectionSnapshotListener<T>(options, (ev, err) =>
      callback(parseResult(ev), err),
    );
  }
  addCollectionGroupSnapshotListener<T extends DocumentData = DocumentData>(
    options: AddCollectionGroupSnapshotListenerOptions,
    callback: AddCollectionGroupSnapshotListenerCallback<T>,
  ): Promise<CallbackId> {
    return this.plugin.addCollectionGroupSnapshotListener<T>(
      options,
      (ev, err) => callback(parseResult(ev), err),
    );
  }
  removeSnapshotListener(
    options: RemoveSnapshotListenerOptions,
  ): Promise<void> {
    return this.plugin.removeSnapshotListener(options);
  }
  removeAllListeners(): Promise<void> {
    return this.plugin.removeAllListeners();
  }
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
 * @param result The result of a read method
 * @returns The parsed result
 */
function parseResult<
  T extends DocumentData,
  U extends
    | Partial<GetDocumentResult<T>>
    | Partial<GetCollectionGroupResult<T>>
    | null,
>(result: U): U {
  if ((result as GetDocumentResult<T>)?.snapshot?.data) {
    (result as GetDocumentResult<T>).snapshot.data = parseResultDocumentData(
      (result as GetDocumentResult<T>).snapshot.data,
    );
  }
  if ((result as GetCollectionGroupResult<T>)?.snapshots) {
    (result as GetCollectionGroupResult<T>).snapshots.map(s =>
      parseResultDocumentData(s),
    );
  }
  return result;
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
