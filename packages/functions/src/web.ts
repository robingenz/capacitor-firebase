import { WebPlugin } from '@capacitor/core';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
} from 'firebase/functions';

import type {
  CallByNameOptions,
  CallByNameResult,
  CallByUrlOptions,
  CallResult,
  FirebaseFunctionsPlugin,
  UseEmulatorOptions,
} from './definitions';

export class FirebaseFunctionsWeb
  extends WebPlugin
  implements FirebaseFunctionsPlugin
{
  public async callByName<RequestData = unknown, ResponseData = unknown>(
    options: CallByNameOptions<RequestData>,
  ): Promise<CallByNameResult<ResponseData>> {
    const functions = getFunctions(undefined, options.region);
    const callable = httpsCallable<RequestData, ResponseData>(
      functions,
      options.name,
      {
        timeout: options.timeout
      }
    );
    const result = await callable(options.data);
    return {
      data: result.data,
    };
  }

  public async callByUrl<RequestData = unknown, ResponseData = unknown>(
    options: CallByUrlOptions<RequestData>,
  ): Promise<CallResult<ResponseData>> {
    const functions = getFunctions();
    const callable = httpsCallableFromURL<RequestData, ResponseData>(
      functions,
      options.url,
      {
        timeout: options.timeout
      }
    );
    const result = await callable(options.data);
    return {
      data: result.data,
    };
  }

  public async useEmulator(options: UseEmulatorOptions): Promise<void> {
    const functions = getFunctions(undefined, options.regionOrCustomDomain);
    const port = options.port || 5001;
    connectFunctionsEmulator(functions, options.host, port);
  }
}
