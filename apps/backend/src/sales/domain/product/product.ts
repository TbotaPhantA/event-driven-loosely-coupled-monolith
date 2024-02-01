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
import { PriceAdjusted } from './events/priceAdjusted';

export class Product implements Importable, Exportable {
  private readonly __meta: Meta;
  private __data: Data;

  constructor(data: Data) {
    this.__data = data;
    this.__meta = { uncommittedEvents: [] };
  }

  static create(command: CreateProduct, deps: Deps): Product {
    const productId = deps.random.generateULID();
    const now = deps.time.now();

    const product = new Product({
      ...command,
      productId,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    });

    product.__meta.uncommittedEvents.push(new ProductCreated({ data: { product: product.export() }}));
    return product;
  }

  adjustPrice(command: AdjustPrice, deps: Pick<Deps, 'time'>): void {
    this.applyPriceAdjusted(PriceAdjusted.from({
      ...command,
      updatedAt: deps.time.now(),
    }));
  }

  private applyPriceAdjusted(event: PriceAdjusted): void {
    this.__data.price = event.data.product.newPrice;
    this.__data.updatedAt = event.data.product.updatedAt;
    this.__meta.uncommittedEvents.push(event );
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
    return this.__meta.uncommittedEvents;
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

interface Meta {
  uncommittedEvents: IEvent[];
}

interface Deps {
  random: RandomService;
  time: TimeService;
}
