import { IProductEvent } from './IProductEvent';
import { Product, ProductData } from '../product';
import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';

interface ProductInfoUpdatedData {
  productId: string;
  changes: {
    updatedAt: Date,
    removedAt: Date,
  },
  before?: ProductData,
  after?: ProductData,
}

export class ProductRemoved implements IProductEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: ProductInfoUpdatedData;

  constructor(data: ProductInfoUpdatedData) {
    this.eventName = ProductRemoved.name;
    this.aggregateId = data.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = data;
  }

  addBefore(before: ProductData): ProductRemoved {
    this.data.before = before;
    return this;
  }

  addAfter(after: ProductData): ProductRemoved {
    this.data.after = after;
    return this;
  }
}
