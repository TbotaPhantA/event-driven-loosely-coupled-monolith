import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';

@Entity({ name: sales_products.name })
export class sales_products {
  @PrimaryColumn()
  product_id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  removed_at!: Date | null;

  static createByRaw(raw: NoMethods<sales_products>): sales_products {
    const entity = new sales_products();

    entity.product_id = raw.product_id;
    entity.name = raw.name;
    entity.description = raw.description;
    entity.price = raw.price;
    entity.created_at = raw.created_at;
    entity.updated_at = raw.updated_at;
    entity.removed_at = raw.removed_at;

    return entity;
  }
}
