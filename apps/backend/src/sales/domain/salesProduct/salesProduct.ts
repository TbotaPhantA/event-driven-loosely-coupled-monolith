import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { AdjustPrice } from './commands/adjustPrice';
import { UpdateProductInfo } from './commands/updateProductInfo';
import { TimeService } from '../../../infrastructure/time/time.service';

interface Deps {
  time: TimeService;
}

export class SalesProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;

  constructor(raw: NoMethods<SalesProduct>) {
    this.productId = raw.productId;
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.removedAt = raw.removedAt;
  }

  adjustPrice(command: AdjustPrice, deps: Deps): void {
    this.price = command.newPrice;
    this.updatedAt = deps.time.now();
  }

  updateProductInfo(command: UpdateProductInfo, deps: Deps): void {
    this.name = command.name;
    this.description = command.description;
    this.updatedAt = deps.time.now();
  }

  markAsRemoved(deps: Deps): void {
    const now = deps.time.now();
    this.updatedAt = now;
    this.removedAt = now;
  }
}
