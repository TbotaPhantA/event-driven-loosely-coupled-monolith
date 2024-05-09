import { EachMessagePayload } from 'kafkajs';
import { assertIsNotEmpty } from './assertIsNotEmpty';

export interface Message {
  headers: {
    id: string,
    messageId: 'string',
    messageType: 'event' | 'command',
    messageName: string,
    correlationId: string,
    aggregateName: string,
    contextName: string,
  };
  key: {
    payload: string,
  };
  value: {
    payload: string,
  };
}

export const extractMessage = (payload: Pick<EachMessagePayload, 'message'>): Message => {
  const valueBuffer = payload.message.value;
  const keyBuffer = payload.message.key;
  const headerBuffers = payload.message.headers;
  assertIsNotEmpty(valueBuffer);
  assertIsNotEmpty(keyBuffer);
  assertIsNotEmpty(headerBuffers);
  const valueStr = valueBuffer.toString();
  const keyStr = keyBuffer.toString();
  const value = JSON.parse(valueStr);
  const key = JSON.parse(keyStr);
  const headers: { [key: string]: string | unknown } = {};

  for (const key in headerBuffers) {
    if (Buffer.isBuffer(headerBuffers[key])) {
      headers[key] = (headerBuffers[key] as Buffer).toString();
    } else {
      headers[key] = headerBuffers[key];
    }
  }

  return <Message>{ value, key, headers };
}
