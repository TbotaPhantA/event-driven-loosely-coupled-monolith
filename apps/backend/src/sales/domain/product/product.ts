import { AdjustPrice } from './commands/adjustPrice';
import { UpdateProductInfo } from './commands/updateProductInfo';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Importable } from '../../../infrastructure/shared/types/importable';
import { Exportable } from '../../../infrastructure/shared/types/exportable';
import { DeepReadonly } from '../../../infrastructure/shared/types/deepReadonly';
import { CreateProduct } from './commands/createProduct';
import { RandomService } from '../../../infrastructure/random/random.service';
import { IEvent } from './events/IEvent';
import { ProductCreated } from './events/productCreated';

export class Product implements Importable, Exportable {
  private __data: Data;
  private readonly __uncommittedEvents: IEvent[];
  constructor(data: Data) {
    this.__data = data;
    this.__uncommittedEvents = [];
  }

  static create(command: CreateProduct, deps: Deps): Product {
    const productId = deps.random.generateULID();
    const now = deps.time.now();

    const product = new Product({
      productId,
      name: command.name,
      description: command.description,
      price: command.price,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    });

    product.__uncommittedEvents.push(new ProductCreated({ data: { product: product.export() }}));
    return product;
  }

  adjustPrice(command: AdjustPrice, deps: Pick<Deps, 'time'>): void {
    this.__data.price = command.newPrice;
    this.__data.updatedAt = deps.time.now();
  }

  updateProductInfo(command: UpdateProductInfo, deps: Pick<Deps, 'time'>): void {
    this.__data.name = command.name;
    this.__data.description = command.description;
    this.__data.updatedAt = deps.time.now();
  }

  markAsRemoved(deps: Pick<Deps, 'time'>): void {
    const now = deps.time.now();
    this.__data.updatedAt = now;
    this.__data.removedAt = now;
  }

  import(data: Data): void { this.__data = data; }
  export(): DeepReadonly<Data> { return this.__data; }
  exportUncommittedEvents(): IEvent[] {
    return this.__uncommittedEvents;
  }
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
  random: RandomService;
  time: TimeService;
}
