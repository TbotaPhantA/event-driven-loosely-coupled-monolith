import { NoMethods } from '../../../infrastructure/shared/types/noMethods';

export class SalesProduct {
  productId: string;
  name: string;
  description: string;
  price: number;

  constructor(raw: NoMethods<SalesProduct>) {
    this.productId = raw.productId;
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
  }
}
