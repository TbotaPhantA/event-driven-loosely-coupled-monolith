import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SalesModule } from './sales/application/sales.module';
import { StorageModule } from './storage/application/storage.module';
import { DatabaseModule } from './infrastructure/db/database.module';
import { AsyncContextMiddleware } from './infrastructure/async-context/middlewares/async-context.middleware';
import { CorrelationModule } from './infrastructure/correlation';
import { ConfigModule } from './infrastructure/config/config.module';

@Module({
  imports: [SalesModule, StorageModule, DatabaseModule, CorrelationModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AsyncContextMiddleware).forRoutes('*');
  }
}
