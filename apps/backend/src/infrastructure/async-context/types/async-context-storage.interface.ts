import { AsyncLocalStorage } from 'async_hooks';

export type AsyncContextStorage = AsyncLocalStorage<Map<string, string>>;
