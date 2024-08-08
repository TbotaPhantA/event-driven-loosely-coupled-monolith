import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from '../../../src/infrastructure/db/database.module';
import { CorrelationModule } from '../../../src/infrastructure/correlation';
import { ConfigModule } from '../../../src/infrastructure/config/config.module';
import { AsyncContextMiddleware } from '../../../src/infrastructure/async-context/middlewares/async-context.middleware';
import { StorageModule } from '../../../src/storage/application/storage.module';

@Module({
  imports: [StorageModule, DatabaseModule, CorrelationModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class StorageTestModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AsyncContextMiddleware).forRoutes('*');
  }
}
