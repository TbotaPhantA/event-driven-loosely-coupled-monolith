import { Inject } from '@nestjs/common';
import { ASYNC_CONTEXT_STORAGE } from '../constants/async-context-storage';

export const InjectAsyncContextStorage = (): ReturnType<typeof Inject> =>
  Inject(ASYNC_CONTEXT_STORAGE);
