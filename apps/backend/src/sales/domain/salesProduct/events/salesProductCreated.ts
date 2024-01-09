import { IEvent } from './IEvent';
import { SalesProductOutputDto } from '../../../application/dto/output/salesProductOutputDto';

export class SalesProductCreated implements IEvent<SalesProductOutputDto> {
  readonly eventName: string = SalesProductCreated.name;
  readonly data: SalesProductOutputDto;

  constructor(data: SalesProductOutputDto) {
    this.data = data;
  }
}
