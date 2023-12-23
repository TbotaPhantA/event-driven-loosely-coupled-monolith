import { Injectable } from '@nestjs/common';

import { ulid } from 'ulid';

import { AsyncContextStorage, InjectAsyncContextStorage } from '../async-context';

import { isString } from 'class-validator';
import { TRACE_ID_KEY } from './correlationConstants';

const isExistsAndValid = isString;

@Injectable()
export class CorrelationService {
  constructor(
    @InjectAsyncContextStorage()
    private readonly asyncContextStorage: AsyncContextStorage,
  ) {}

  public startNewTraceId(existingTraceId?: string | any): string {
    const traceId = isExistsAndValid(existingTraceId) ? existingTraceId : ulid();

    const contextStore = this.asyncContextStorage.getStore();

    if (contextStore) {
      contextStore.set(TRACE_ID_KEY, traceId);
    }

    return traceId;
  }

  public getTraceId(): string {
    const store = this.asyncContextStorage.getStore();
    return store?.get(TRACE_ID_KEY) ?? '';
  }
}
