import { ProductData } from '../product';

interface EventData<T extends Record<string, any>> {
  productId: string;
  changes: Partial<T>;
  before?: T;
  after?: T;
}

export interface IProductEvent<State extends ProductData = ProductData> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: EventData<State>;
  addBefore(state: State): void;
  addAfter(state: State): void;
}
