import { SalesProduct } from '../salesProduct';
import { IEvent } from './IEvent';

export class SalesProductCreated implements IEvent<SalesProduct> {
  readonly eventName: string = SalesProductCreated.name;
  readonly data: SalesProduct;

  constructor(data: SalesProduct) {
    this.data = data;
  }
}
