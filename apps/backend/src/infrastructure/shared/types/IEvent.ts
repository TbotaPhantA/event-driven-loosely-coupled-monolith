export interface IEvent {
  readonly messageId: number;
  readonly name: string;
  readonly aggregateId: string;
  readonly data: object;
}
