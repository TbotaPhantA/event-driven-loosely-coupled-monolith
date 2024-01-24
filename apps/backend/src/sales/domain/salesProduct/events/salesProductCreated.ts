import { IEvent } from './IEvent';
import { SalesProductOutputDto } from '../../../application/dto/output/salesProductOutputDto';

export interface SalesProductCreatedData {
  product: SalesProductOutputDto;
}

export class SalesProductCreated implements IEvent<SalesProductCreatedData> {
  readonly eventName: string = SalesProductCreated.name;
  readonly data: SalesProductCreatedData;

  constructor(data: SalesProductCreatedData) {
    this.data = data;
  }
}
