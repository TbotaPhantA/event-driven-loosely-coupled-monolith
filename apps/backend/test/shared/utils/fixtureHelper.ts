import { DataSource, In } from 'typeorm';
import { ProductEntity } from '../../../src/sales/dal/product/product.entity';
import { SalesProductMessage } from '../../../src/infrastructure/messages/entities/salesProductMessage.entity';
import { SalesProductRequestEntity } from '../../../src/infrastructure/idempotency/entities/salesProductRequest.entity';
import { InventoryItemEntity } from '../../../src/storage/dal/inventoryItem.entity';
import {
  SalesProductIdempMessageEntity
} from '../../../src/infrastructure/idempotency/entities/salesProductIdempMessageEntity';

export class FixtureHelper {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async insertProduct(product: ProductEntity): Promise<ProductEntity> {
    const salesProductRepo = this.dataSource.getRepository(ProductEntity);
    return salesProductRepo.save(product);
  }

  async cleanupProductDataInDB(productId: string | undefined): Promise<void> {
    if (!productId) return;
    const salesProductRepo = this.dataSource.getRepository(ProductEntity);
    await salesProductRepo.delete({ productId });

    const salesProductOutboxRepo = this.dataSource.getRepository(SalesProductMessage);
    await salesProductOutboxRepo.delete({ aggregateId: productId });

    const SalesProductRequestEntityRepo = this.dataSource.getRepository(SalesProductRequestEntity);
    await SalesProductRequestEntityRepo.delete({ productId });
  }

  async cleanupInventoryItemInDB(inventoryItemIds: string[]): Promise<void> {
    if (inventoryItemIds.length === 0) return;
    const repo = this.dataSource.getRepository(InventoryItemEntity);
    await repo.delete({ inventoryItemId: In(inventoryItemIds) });
  }

  async cleanupIdempMessageInDB(messageIds: string[]): Promise<void> {
    if (messageIds.length === 0) return;
    const repo = this.dataSource.getRepository(SalesProductIdempMessageEntity);
    await repo.delete({ messageId: In(messageIds) });
  }
}
