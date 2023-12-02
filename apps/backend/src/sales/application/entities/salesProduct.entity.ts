import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';

@Entity({ name: 'sales_products' })
export class SalesProductEntity {
  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  constructor(raw: NoMethods<SalesProductEntity>) {
    this.productId = raw.productId;
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
  }
}
