import { AsyncLocalStorage } from 'async_hooks';

import { Global, Module } from '@nestjs/common';

import { ASYNC_CONTEXT_STORAGE } from './constants/async-context-storage';

@Global()
@Module({
  providers: [
    {
      provide: ASYNC_CONTEXT_STORAGE,
      useValue: new AsyncLocalStorage<Map<string, string>>(),
    },
  ],
  exports: [ASYNC_CONTEXT_STORAGE],
})
export class AsyncContextModule {}
