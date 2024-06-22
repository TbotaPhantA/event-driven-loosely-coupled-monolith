import { Consumer, EachMessagePayload, Kafka, Partitioners, Producer } from 'kafkajs';
import { extractMessage, Message } from '../../../../src/infrastructure/shared/utils/extractMessage';
import { waitForMatchingPayload } from '../messageBroker/waitForMatchingPayload';
import { config } from '../../../../src/infrastructure/config/config';
import { createKafka } from '../messageBroker/createKafka';
import { ulid } from 'ulid';

export class MessagesHelper {
  private messagePayloads: Array<EachMessagePayload>;
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.messagePayloads = new Array<EachMessagePayload>;
    this.kafka = createKafka();
    this.producer = this.kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
  }

  async getMessageByCorrelationId(correlationId: string): Promise<Message> {
    return extractMessage(await waitForMatchingPayload(this.messagePayloads, correlationId))
  }

  async startConsumerFillingMessagePayloads(): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId: ulid() });
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
