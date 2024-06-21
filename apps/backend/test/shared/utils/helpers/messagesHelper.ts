import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { extractMessage, Message } from '../../../../src/infrastructure/shared/utils/extractMessage';
import { waitForMatchingPayload } from '../messageBroker/waitForMatchingPayload';
import { config } from '../../../../src/infrastructure/config/config';

export class MessagesHelper {
  private messagePayloads: Array<EachMessagePayload>;

  constructor() {
    this.messagePayloads = new Array<EachMessagePayload>;
  }

  async getMessageByCorrelationId(correlationId: string): Promise<Message> {
    return extractMessage(await waitForMatchingPayload(this.messagePayloads, correlationId))
  }

  async startConsumerFillingMessagePayloads(
    kafka: Kafka,
  ): Promise<Consumer> {
    const consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });
    await consumer.connect();
    await consumer.subscribe({
      topic: config.kafka.kafkaProductsTopic,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async (payload) => {
        this.messagePayloads.push(payload);
      },
    })

    return consumer;
  }
}
