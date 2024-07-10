import { registerPlugin } from '@capacitor/core';

import { getClientPlugin } from './client';
import type { FirebaseFirestorePlugin } from './definitions';

const FirebaseFirestore = getClientPlugin(
  registerPlugin<FirebaseFirestorePlugin>('FirebaseFirestore', {
    web: () => import('./web').then(m => new m.FirebaseFirestoreWeb()),
  }),
);

export * from './definitions';
export * from './timestamp';
export * from './field-value';
export { FirebaseFirestore };
