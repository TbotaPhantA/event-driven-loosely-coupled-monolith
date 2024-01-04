import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SalesProductEntity } from '../../../sales/application/entities/salesProduct.entity';
import { NoMethods } from '../../shared/types/noMethods';

@Entity({ name: 'sales_product_requests' })
export class SalesProductRequestEntity {
  @PrimaryColumn({ name: 'correlation_id' })
  correlationId!: string;

  @ManyToOne(() => SalesProductEntity)
  salesProduct!: SalesProductEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  static from(raw: NoMethods<Omit<SalesProductRequestEntity, 'createdAt'>>): SalesProductRequestEntity {
    const salesProductRequestEntity = new SalesProductRequestEntity();
    salesProductRequestEntity.correlationId = raw.correlationId;
    salesProductRequestEntity.salesProduct = raw.salesProduct;
    return salesProductRequestEntity;
  }
}
