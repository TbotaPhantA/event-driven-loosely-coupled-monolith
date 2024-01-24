import { IEvent } from './IEvent';
import { SalesProductOutputDto } from '../../../application/dto/output/salesProductOutputDto';

type SalesProductCreatedData = { product: SalesProductOutputDto }

export class SalesProductCreated implements IEvent<SalesProductCreatedData> {
  readonly eventName: string = SalesProductCreated.name;
  readonly aggregateId: string;
  readonly data: {
    product: SalesProductOutputDto;
  };

  constructor(raw: Pick<SalesProductCreated, 'aggregateId' | 'data'>) {
    this.aggregateId = raw.aggregateId;
    this.data = raw.data;
  }
}
