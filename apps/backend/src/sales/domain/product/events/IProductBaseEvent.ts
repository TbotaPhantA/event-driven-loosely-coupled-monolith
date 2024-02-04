import { ProductData } from '../product';

interface EventData<T extends Record<string, any>> {
  productId: string;
  changes: Partial<T>;
}

export interface IProductBaseEvent<State extends ProductData = ProductData> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: EventData<State>;
}
