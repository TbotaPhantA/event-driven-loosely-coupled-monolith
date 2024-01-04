import { EachMessagePayload } from 'kafkajs';
import { assertIsNotEmpty } from '../../../src/infrastructure/shared/utils/assertIsNotEmpty';

interface Message {
  headers: object;
  key: object;
  value: object;
}

export const extractMessage = (payload: EachMessagePayload): Message => {
  const valueBuffer = payload.message.value;
  const keyBuffer = payload.message.key;
  const headersBuffer = payload.message.headers;
  assertIsNotEmpty(valueBuffer);
  assertIsNotEmpty(keyBuffer);
  assertIsNotEmpty(headersBuffer);
  const value = JSON.parse(valueBuffer.toString())
  const key = JSON.parse(keyBuffer.toString())
  const headers = Object.entries(headersBuffer).map(([key, headerValue]) => {
    const headerValueStr = headerValue?.toString();

    try {
      const newValue = headerValueStr ? JSON.parse(headerValueStr) : headerValue;
      return { [key]: newValue };
    } catch (error) {
      return { [key]: headerValueStr };
    }
  });
  return { value, key, headers };
}
