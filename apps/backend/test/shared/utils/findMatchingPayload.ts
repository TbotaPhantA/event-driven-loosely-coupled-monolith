import { EachMessagePayload } from 'kafkajs';

export const findMatchingPayload = (correlationId: string) =>
  (payload: EachMessagePayload): boolean => payload.message.headers?.correlationId?.toString() === correlationId
