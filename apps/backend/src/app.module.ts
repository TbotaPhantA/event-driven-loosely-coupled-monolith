import { Module } from '@nestjs/common';
import { SalesModule } from './sales/application/sales.module';
import { StorageModule } from './storage/application/storage.module';
import { DatabaseModule } from './infrastructure/db/database.module';

@Module({
  imports: [SalesModule, StorageModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
