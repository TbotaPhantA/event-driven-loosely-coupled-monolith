import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { AdjustPrice } from './commands/adjustPrice';
import { UpdateProductInfo } from './commands/updateProductInfo';

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

  adjustPrice(command: AdjustPrice): void {
    this.price = command.newPrice;
  }

  updateProductInfo(command: UpdateProductInfo): void {
    this.name = command.name;
    this.description = command.description;
  }
}
