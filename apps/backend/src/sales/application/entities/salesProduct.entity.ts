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

  static createByRaw(raw: NoMethods<SalesProductEntity>): SalesProductEntity {
    const entity = new SalesProductEntity();

    entity.productId = raw.productId;
    entity.name = raw.name;
    entity.description = raw.description;
    entity.price = raw.price;

    return entity;
  }
}
