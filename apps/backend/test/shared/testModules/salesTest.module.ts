import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SalesModule } from '../../../src/sales/application/sales.module';
import { DatabaseModule } from '../../../src/infrastructure/db/database.module';
import { CorrelationModule } from '../../../src/infrastructure/correlation';
import { ConfigModule } from '../../../src/infrastructure/config/config.module';
import { AsyncContextMiddleware } from '../../../src/infrastructure/async-context/middlewares/async-context.middleware';

@Module({
  imports: [SalesModule, DatabaseModule, CorrelationModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class SalesTestModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AsyncContextMiddleware).forRoutes('*');
  }
}
