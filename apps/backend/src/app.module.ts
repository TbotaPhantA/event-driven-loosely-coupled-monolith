import { Module } from '@nestjs/common';
import { SalesModule } from './sales/application/sales.module';
import { StorageModule } from './storage/application/storage.module';

@Module({
  imports: [SalesModule, StorageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
