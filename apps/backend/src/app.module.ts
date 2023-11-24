import { Module } from '@nestjs/common';
import { SalesModule } from './sales/sales.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [SalesModule, StorageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
