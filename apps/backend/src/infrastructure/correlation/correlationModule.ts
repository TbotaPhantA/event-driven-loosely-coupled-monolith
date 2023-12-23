import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncContextModule } from '../async-context';
import { CorrelationService } from './correlation.service';
import { CorrelationMiddleware } from './middleware/correlation-middleware.service';

@Global()
@Module({
  imports: [AsyncContextModule],
  providers: [CorrelationService],
  exports: [CorrelationService],
})
export class CorrelationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
