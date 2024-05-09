import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventoryItem/inventoryItem.controller';

@Module({
  controllers: [InventoryItemController],
})
export class StorageModule {}
