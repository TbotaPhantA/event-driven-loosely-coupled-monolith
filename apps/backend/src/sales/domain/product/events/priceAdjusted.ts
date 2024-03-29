import { IProductEvent } from './IProductEvent';
import { Product, ProductData } from '../product';
import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';

interface PriceAdjustedEventData {
  productId: string;
  changes: {
    price: ProductData['price'];
    updatedAt: ProductData['updatedAt'];
  },
  before?: ProductData,
  after?: ProductData,
}

export class PriceAdjusted implements IProductEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: PriceAdjustedEventData;

  constructor(data: PriceAdjustedEventData) {
    this.eventName = PriceAdjusted.name;
    this.aggregateId = data.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = data;
  }

  addBefore(before: ProductData): PriceAdjusted {
    this.data.before = before;
    return this;
  }

  addAfter(after: ProductData): PriceAdjusted {
    this.data.after = after;
    return this;
  }
}
