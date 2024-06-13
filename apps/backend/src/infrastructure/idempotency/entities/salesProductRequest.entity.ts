import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../shared/types/noMethods';
import {
  IdempotentResponses,
} from '../../../sales/application/product/services/interfaces/IProductIdempotency.service';

@Entity({ name: 'sales_product_requests' })
export class SalesProductRequestEntity {
  @PrimaryColumn({ name: 'correlation_id' })
  correlationId!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column({ type: 'jsonb' })
  response!: IdempotentResponses;

  @CreateDateColumn({
    name: 'created_at',
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  static from(raw: NoMethods<Omit<SalesProductRequestEntity, 'createdAt'>>): SalesProductRequestEntity {
    const salesProductRequestEntity = new SalesProductRequestEntity();
    salesProductRequestEntity.correlationId = raw.correlationId;
    salesProductRequestEntity.response = raw.response;
    salesProductRequestEntity.productId = raw.productId;
    return salesProductRequestEntity;
  }
}
