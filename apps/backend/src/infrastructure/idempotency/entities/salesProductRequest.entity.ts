import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../shared/types/noMethods';
import { ProductOutputDto } from '../../../sales/application/dto/output/productOutputDto';

@Entity({ name: 'sales_product_requests' })
export class SalesProductRequestEntity {
  @PrimaryColumn({ name: 'correlation_id' })
  correlationId!: string;

  @Column({ type: 'jsonb' })
  data!: ProductOutputDto;

  @CreateDateColumn({
    name: 'created_at',
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  static from(raw: NoMethods<Omit<SalesProductRequestEntity, 'createdAt'>>): SalesProductRequestEntity {
    const salesProductRequestEntity = new SalesProductRequestEntity();
    salesProductRequestEntity.correlationId = raw.correlationId;
    salesProductRequestEntity.data = raw.data;
    return salesProductRequestEntity;
  }
}
