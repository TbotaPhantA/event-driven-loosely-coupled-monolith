import { AdjustPrice } from './commands/adjustPrice';
import { UpdateProductInfo } from './commands/updateProductInfo';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Importable } from '../../../infrastructure/shared/types/importable';
import { Exportable } from '../../../infrastructure/shared/types/exportable';

export class SalesProduct implements Importable<Data>, Exportable<Data> {
  private __data: Data;
  constructor(data: Data) { this.__data = data; }

  adjustPrice(command: AdjustPrice, deps: Deps): void {
    this.__data.price = command.newPrice;
    this.__data.updatedAt = deps.time.now();
  }

  updateProductInfo(command: UpdateProductInfo, deps: Deps): void {
    this.__data.name = command.name;
    this.__data.description = command.description;
    this.__data.updatedAt = deps.time.now();
  }

  markAsRemoved(deps: Deps): void {
    const now = deps.time.now();
    this.__data.updatedAt = now;
    this.__data.removedAt = now;
  }

  import(data: Data): void { this.__data = data; }
  export(): Data { return this.__data; }
}

interface Data {
  productId: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}

interface Deps {
  time: TimeService;
}
