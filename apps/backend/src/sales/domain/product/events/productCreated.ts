import { IEvent } from './IEvent';
import { ProductOutputDto } from '../../../application/dto/output/productOutputDto';

type ProductCreatedData = { product: ProductOutputDto }

export class ProductCreated implements IEvent<ProductCreatedData> {
  readonly eventName: string = ProductCreated.name;
  readonly aggregateId: string;
  readonly data: { product: ProductOutputDto };

  constructor(raw: Pick<ProductCreated, 'aggregateId' | 'data'>) {
    this.aggregateId = raw.aggregateId;
    this.data = raw.data;
  }
}
