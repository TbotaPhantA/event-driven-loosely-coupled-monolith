import { IEvent } from './IEvent';
import { Product } from '../product';
import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';
import { AdjustPrice } from '../commands/adjustPrice';

type PriceAdjustedEventData = {
  product: {
    productId: string,
    newPrice: number,
    updatedAt: Date;
  }
}

export class PriceAdjusted implements IEvent<PriceAdjustedEventData> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: PriceAdjustedEventData;

  constructor(data: PriceAdjustedEventData) {
    this.eventName = PriceAdjusted.name;
    this.aggregateId = data.product.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = data;
  }

  static from({ newPrice, productId, updatedAt }: AdjustPrice & { updatedAt: Date }): PriceAdjusted {
    return new PriceAdjusted({
      product: { productId, newPrice, updatedAt },
    })
  }
}
