import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventoryItem/inventoryItem.controller';
import { SalesMessagesController } from '../acl/salesMessages.controller';
import { InventoryItemCreateService } from './inventoryItem/services/inventoryItemCreate.service';
import { INVENTORY_ITEM_REPOSITORY } from './shared/constants';
import { DatabaseInventoryItemRepository } from '../dal/databaseInventoryItem.repository';
import { TransactionModule } from '../../infrastructure/transaction/transaction.module';
import { TimeModule } from '../../infrastructure/time/time.module';
import { SalesACLService } from '../acl/salesACL.service';
import { InventoryItemReadService } from './inventoryItem/services/inventoryItemRead.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemEntity } from '../dal/inventoryItem.entity';
import { IdempotencyModule } from '../../infrastructure/idempotency/idempotency.module';

@Module({
  imports: [
    TransactionModule,
    TimeModule,
    IdempotencyModule,
    TypeOrmModule.forFeature([InventoryItemEntity]),
  ],
  controllers: [InventoryItemController, SalesMessagesController],
  providers: [
    {
      provide: INVENTORY_ITEM_REPOSITORY,
      useClass: DatabaseInventoryItemRepository,
    },
    InventoryItemReadService,
    InventoryItemCreateService,
    SalesACLService,
  ],
})
export class StorageModule {}
