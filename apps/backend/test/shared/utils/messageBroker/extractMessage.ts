import { EachMessagePayload } from 'kafkajs';
import { assertIsNotEmpty } from '../../../../src/infrastructure/shared/utils/assertIsNotEmpty';

interface Message {
  headers: object;
  key: {
    schema: object,
    payload: string,
  };
  value: {
    schema: object,
    payload: string,
  };
}

export const extractMessage = (payload: EachMessagePayload): Message => {
  const valueBuffer = payload.message.value;
  const keyBuffer = payload.message.key;
  const headerBuffers = payload.message.headers;
  assertIsNotEmpty(valueBuffer);
  assertIsNotEmpty(keyBuffer);
  assertIsNotEmpty(headerBuffers);
  const value = JSON.parse(valueBuffer.toString())
  const key = JSON.parse(keyBuffer.toString())
  const headers: { [key: string]: string | unknown } = {};

  for (const key in headerBuffers) {
    if (Buffer.isBuffer(headerBuffers[key])) {
      headers[key] = (headerBuffers[key] as Buffer).toString();
    } else {
      headers[key] = headerBuffers[key];
    }
  }

  return { value, key, headers };
}
