import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';

@Entity({ name: 'sales_products' })
export class SalesProductEntity {
  @PrimaryColumn({ name: 'product_id' })
  productId!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ name: 'removed_at', type: 'timestamp with time zone', nullable: true })
  removedAt!: Date | null;

  static createByRaw(raw: NoMethods<SalesProductEntity>): SalesProductEntity {
    const entity = new SalesProductEntity();

    entity.productId = raw.productId;
    entity.name = raw.name;
    entity.description = raw.description;
    entity.price = raw.price;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.removedAt = raw.removedAt;

    return entity;
  }
}
