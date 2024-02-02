export interface IEvent<T extends Record<string, any> = Record<string, any>> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly aggregateName: string;
  readonly contextName: string;
  readonly data: T;
}
