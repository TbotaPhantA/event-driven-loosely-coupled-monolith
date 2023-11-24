export interface IEvent<T extends object = object> {
  readonly id: string;
  readonly aggregateId: string;
  readonly data: T;
  readonly version?: number;
}
