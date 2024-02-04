import { IProductEvent } from './IProductEvent';
import { Product, ProductData } from '../product';
import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';

interface ProductInfoUpdatedData {
  productId: string;
  changes: {
    name: string;
    description: string;
    updatedAt: Date;
  },
  before?: ProductData,
  after?: ProductData,
}

export class ProductInfoUpdated implements IProductEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: ProductInfoUpdatedData;

  constructor(data: ProductInfoUpdatedData) {
    this.eventName = ProductInfoUpdated.name;
    this.aggregateId = data.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = data;
  }

  addBefore(before: ProductData): ProductInfoUpdated {
    this.data.before = before;
    return this;
  }

  addAfter(after: ProductData): ProductInfoUpdated {
    this.data.after = after;
    return this;
  }
}
