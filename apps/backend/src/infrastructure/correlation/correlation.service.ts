import { Injectable } from '@nestjs/common';

import { ulid } from 'ulid';

import { AsyncContextStorage, InjectAsyncContextStorage } from '../async-context';

import { isString } from 'class-validator';
import { CORRELATION_ID_KEY } from './correlationConstants';

const doesExistAndValid = isString;

@Injectable()
export class CorrelationService {
  constructor(
    @InjectAsyncContextStorage()
    private readonly asyncContextStorage: AsyncContextStorage,
  ) {}

  public startNewCorrelationId(existingCorrelationId?: string | any): string {
    const correlationId = doesExistAndValid(existingCorrelationId) ? existingCorrelationId : ulid();

    const contextStore = this.asyncContextStorage.getStore();

    if (contextStore) {
      contextStore.set(CORRELATION_ID_KEY, correlationId);
    }

    return correlationId;
  }

  public getCorrelationId(): string {
    const store = this.asyncContextStorage.getStore();
    return store?.get(CORRELATION_ID_KEY) ?? '';
  }
}
