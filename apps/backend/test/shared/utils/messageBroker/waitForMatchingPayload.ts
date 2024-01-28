import { EachMessagePayload } from 'kafkajs';
import { sleep } from '../../../../src/infrastructure/shared/utils/sleep';
import { findMatchingPayload } from './findMatchingPayload';

export const waitForMatchingPayload = async (
  messagePayloads: EachMessagePayload[],
  correlationId: string,
): Promise<EachMessagePayload> => {
  while (true) {
    await sleep(100);

    const matchingPayload = messagePayloads.find(findMatchingPayload(correlationId));

    if (matchingPayload) {
      return matchingPayload;
    }
  }
}
