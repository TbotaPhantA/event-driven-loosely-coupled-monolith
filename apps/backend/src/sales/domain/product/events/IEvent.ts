export interface IEvent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly eventName: string;
  readonly aggregateId: string;
  readonly data: T;
}
