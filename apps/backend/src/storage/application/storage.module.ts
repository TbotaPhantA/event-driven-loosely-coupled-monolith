import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventoryItem/inventoryItem.controller';
import { SalesMessagesController } from '../acl/salesMessages.controller';

@Module({
  controllers: [InventoryItemController, SalesMessagesController],
})
export class StorageModule {}
