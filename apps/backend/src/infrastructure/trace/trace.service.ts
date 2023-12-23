import { Injectable } from '@nestjs/common';

import { ulid } from 'ulid';

import { AsyncContextStorage, InjectAsyncContextStorage } from '../async-context';

import { TraceId } from './interfaces/traceId';
import { TRACE_ID_KEY } from './trace-constants';
import { isString } from 'class-validator';

const isExistsAndValid = isString;

@Injectable()
export class TraceService {
  constructor(
    @InjectAsyncContextStorage()
    private readonly asyncContextStorage: AsyncContextStorage,
  ) {}

  public startNewTraceId(existingTraceId?: string | any): TraceId {
    const traceId = isExistsAndValid(existingTraceId) ? existingTraceId : ulid();

    const contextStore = this.asyncContextStorage.getStore();

    if (contextStore) {
      contextStore.set(TRACE_ID_KEY, traceId);
    }

    return traceId;
  }

  public getTraceId(): TraceId {
    const store = this.asyncContextStorage.getStore();
    return store?.get(TRACE_ID_KEY) ?? '';
  }
}
