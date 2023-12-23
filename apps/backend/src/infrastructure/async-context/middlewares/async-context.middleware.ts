import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectAsyncContextStorage } from '../decorators';
import { AsyncContextStorage } from '../types/async-context-storage.interface';
import * as http from 'http';

@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
  constructor(
    @InjectAsyncContextStorage()
    private readonly asyncContextStorage: AsyncContextStorage,
  ) {}

  public use(_: http.IncomingMessage, __: http.ServerResponse, next: () => void): void {
    this.asyncContextStorage.run(new Map(), () => {
      next();
    });
  }
}
