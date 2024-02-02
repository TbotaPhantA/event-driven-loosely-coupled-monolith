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
import * as _ from 'lodash';

export class Product implements Importable, Exportable {
  private readonly __meta: Meta;
  private __data: ProductData;

  constructor(data: ProductData) {
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
    const priceAdjusted = new PriceAdjusted({
      productId: command.productId,
      changes: {
        price: command.newPrice,
        updatedAt: deps.time.now(),
      },
      before: this.export(),
    });

    this.applyPriceAdjusted(priceAdjusted);
    priceAdjusted.addAfter(this.export());
    this.__meta.uncommittedEvents.push(priceAdjusted);
  }

  private applyPriceAdjusted(event: PriceAdjusted): void {
    this.__data.price = event.data.changes.price
    this.__data.updatedAt = event.data.changes.updatedAt;
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

  import(data: ProductData): void { this.__data = data; }
  export(): DeepReadonly<ProductData> { return _.cloneDeep(this.__data); }
  exportUncommittedEvents(): IEvent[] {
    return this.__meta.uncommittedEvents;
  }
}

export interface ProductData {
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
