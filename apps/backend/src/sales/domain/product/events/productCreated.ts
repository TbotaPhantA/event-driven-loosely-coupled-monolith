import { IEvent } from './IEvent';
import { SALES_CONTEXT_NAME } from '../../../application/shared/constants';
import { Product } from '../product';

type ProductCreatedData = { product: ReturnType<Product['export']> }

export class ProductCreated implements IEvent<ProductCreatedData> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: ProductCreatedData;

  constructor(raw: Pick<ProductCreated, 'data'>) {
    this.eventName = ProductCreated.name;
    this.aggregateId = raw.data.product.productId;
    this.aggregateName = Product.name;
    this.contextName = SALES_CONTEXT_NAME;
    this.data = raw.data;
  }
}
