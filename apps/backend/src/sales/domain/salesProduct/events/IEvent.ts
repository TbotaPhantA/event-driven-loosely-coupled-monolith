export interface IEvent<T extends object> {
  readonly eventName: string;
  readonly data: T;
}
