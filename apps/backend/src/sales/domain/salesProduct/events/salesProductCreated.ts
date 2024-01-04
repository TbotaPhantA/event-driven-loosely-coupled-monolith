import { IEvent } from './IEvent';
import { SalesProduct } from '../salesProduct';

export class SalesProductCreated implements IEvent {
  readonly eventName: string = SalesProductCreated.name;
  readonly data: SalesProduct;
  constructor(data: SalesProduct) {
    this.data = data;
  }
}
