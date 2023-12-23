import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncContextModule } from '../async-context';
import { TraceService } from './trace.service';
import { TraceMiddleware } from './middleware/trace.middleware';

@Global()
@Module({
  imports: [AsyncContextModule],
  providers: [TraceService],
  exports: [TraceService],
})
export class TraceModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
