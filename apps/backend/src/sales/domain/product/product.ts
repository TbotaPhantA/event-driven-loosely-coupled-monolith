import { AdjustPrice } from './commands/adjustPrice';
import { UpdateProductInfo } from './commands/updateProductInfo';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Importable } from '../../../infrastructure/shared/types/importable';
import { Exportable } from '../../../infrastructure/shared/types/exportable';
import { DeepReadonly } from '../../../infrastructure/shared/types/deepReadonly';
import { CreateProduct } from './commands/createProduct';
import { RandomService } from '../../../infrastructure/random/random.service';
import { IProductEvent } from './events/IProductEvent';
import { ProductCreated } from './events/productCreated';
import { PriceAdjusted } from './events/priceAdjusted';
import * as _ from 'lodash';
import { ProductInfoUpdated } from './events/productInfoUpdated';
import { IProductBaseEvent } from './events/IProductBaseEvent';

export class Product implements Importable, Exportable {
  private readonly __meta: Meta;
  private __data: ProductData;

  constructor(data: ProductData) {
    this.__data = data;
    this.__meta = { uncommittedEvents: [] };
  }

  static create(command: CreateProduct, deps: Deps): Product {
    const now = deps.time.now();
    const product = new Product({
      ...command,
      productId: deps.random.generateULID(),
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    });

    const exported = product.export();
    product.__meta.uncommittedEvents.push(new ProductCreated({
      data: {
        productId: exported.productId,
        changes: exported,
      },
    }));
    return product;
  }

  adjustPrice(command: AdjustPrice, deps: Pick<Deps, 'time'>): void {
    const priceAdjusted = new PriceAdjusted({
      productId: this.__data.productId,
      changes: {
        price: command.newPrice,
        updatedAt: deps.time.now(),
      },
    });

    this.addEvent(priceAdjusted);
  }


  updateProductInfo(command: UpdateProductInfo, deps: Pick<Deps, 'time'>): void {
    const productInfoUpdated = new ProductInfoUpdated({
      productId: this.__data.productId,
      changes: {
        name: command.name,
        description: command.description,
        updatedAt: deps.time.now(),
      }
    });

    this.addEvent(productInfoUpdated);
  }

  remove(deps: Pick<Deps, 'time'>): void {
    const now = deps.time.now();
    this.__data.updatedAt = now;
    this.__data.removedAt = now;
  }

  private addEvent(event: IProductEvent<ProductData>): void {
    event.addBefore(this.export());
    this.apply(event);
    event.addAfter(this.export());
    this.__meta.uncommittedEvents.push(event);
  }

  private apply(event: IProductEvent<ProductData>): void {
    if (event instanceof PriceAdjusted) {
      this.applyPriceAdjusted(event);
    } else if (event instanceof ProductInfoUpdated) {
      this.applyProductInfoUpdated(event);
    }
  }

  private applyPriceAdjusted(event: PriceAdjusted): void {
    this.__data.price = event.data.changes.price
    this.__data.updatedAt = event.data.changes.updatedAt;
  }

  private applyProductInfoUpdated(event: ProductInfoUpdated): void {
    this.__data.name = event.data.changes.name;
    this.__data.description = event.data.changes.description;
    this.__data.updatedAt = event.data.changes.updatedAt;
  }

  import(data: ProductData): void { this.__data = data; }
  export(): DeepReadonly<ProductData> { return _.cloneDeep(this.__data); }
  exportUncommittedEvents(): (IProductEvent | IProductBaseEvent)[] {
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
  uncommittedEvents: (IProductEvent | IProductBaseEvent)[];
}

interface Deps {
  random: RandomService;
  time: TimeService;
}
