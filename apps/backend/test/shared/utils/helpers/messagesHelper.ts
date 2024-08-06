import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { extractMessage, Message } from '../../../../src/infrastructure/shared/utils/extractMessage';
import { waitForMatchingPayload } from '../messageBroker/waitForMatchingPayload';
import { config } from '../../../../src/infrastructure/config/config';
import { createKafka } from '../messageBroker/createKafka';
import { ulid } from 'ulid';

export class MessagesHelper {
  private readonly messagePayloads: Array<EachMessagePayload>;
  private readonly consumer: Consumer;
  private readonly kafka: Kafka;

  constructor() {
    this.messagePayloads = new Array<EachMessagePayload>;
    this.kafka = createKafka();
    this.consumer = this.kafka.consumer({ groupId: ulid() });
  }

  async getMessageByCorrelationId(correlationId: string): Promise<Message> {
    return extractMessage(await waitForMatchingPayload(this.messagePayloads, correlationId))
  }

  async startConsumerFillingMessagePayloads(): Promise<Consumer> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: config.kafka.kafkaProductsTopic,
      fromBeginning: false,
    });
    await this.consumer.run({
      eachMessage: async (payload) => {
        this.messagePayloads.push(payload);
      },
    })

    return this.consumer;
  }

  async stopConsumer(): Promise<void> {
    await this.consumer.stop();
    await this.consumer.disconnect();
  }
}
