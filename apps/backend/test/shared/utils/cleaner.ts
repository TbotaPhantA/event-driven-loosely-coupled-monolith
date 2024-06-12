import { DataSource } from 'typeorm';
import { ProductEntity } from '../../../src/sales/dal/product/product.entity';
import { SalesProductMessage } from '../../../src/infrastructure/messages/entities/salesProductMessage.entity';
import { SalesProductRequestEntity } from '../../../src/infrastructure/idempotency/entities/salesProductRequest.entity';

export class Cleaner {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async cleanupProductDataInDB(productId: string): Promise<void> {
    const salesProductRepo = this.dataSource.getRepository(ProductEntity);
    await salesProductRepo.delete({ productId });

    const salesProductOutboxRepo = this.dataSource.getRepository(SalesProductMessage);
    await salesProductOutboxRepo.delete({ aggregateId: productId });

    const SalesProductRequestEntityRepo = this.dataSource.getRepository(SalesProductRequestEntity);
    await SalesProductRequestEntityRepo.delete({ productId });
  }
}
