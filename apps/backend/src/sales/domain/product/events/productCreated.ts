import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';
import { Product, ProductData } from '../product';
import { IProductBaseEvent } from './IProductBaseEvent';

type ProductCreatedData = {
  productId: ProductData['productId'];
  changes: ProductData;
}

export class ProductCreated implements IProductBaseEvent {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: ProductCreatedData;

  constructor(raw: Pick<ProductCreated, 'data'>) {
    this.eventName = ProductCreated.name;
    this.aggregateId = raw.data.changes.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = raw.data;
  }
}
