import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { AdjustPrice } from './commands/adjustPrice';

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
}
