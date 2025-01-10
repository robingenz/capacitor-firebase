import { registerPlugin } from '@capacitor/core';

import { FirebaseFirestoreClient } from './client';
import type { FirebaseFirestorePlugin } from './definitions';

const FirebaseFirestore: FirebaseFirestorePlugin = new FirebaseFirestoreClient(
  registerPlugin<FirebaseFirestorePlugin>('FirebaseFirestore', {
    web: () => import('./web').then(m => new m.FirebaseFirestoreWeb()),
  }),
);

export * from './definitions';
export * from './timestamp';
export * from './field-value';
export { FirebaseFirestore };
