export class MessageIsAlreadyProcessedException extends Error {
  constructor() {
    super('MESSAGE_IS_ALREADY_PROCESSED_EXCEPTION');
  }
}
