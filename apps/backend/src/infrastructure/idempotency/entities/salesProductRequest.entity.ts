import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../shared/types/noMethods';
import { SalesProductOutputDto } from '../../../sales/application/dto/output/salesProductOutputDto';

@Entity({ name: 'sales_product_requests' })
export class SalesProductRequestEntity {
  @PrimaryColumn({ name: 'correlation_id' })
  correlationId!: string;

  @Column({ type: 'jsonb' })
  salesProduct!: SalesProductOutputDto;

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
