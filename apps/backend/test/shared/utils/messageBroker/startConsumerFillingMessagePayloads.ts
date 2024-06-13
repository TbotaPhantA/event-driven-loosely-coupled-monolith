import { config } from '../../../../src/infrastructure/config/config';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';

export const startConsumerFillingMessagePayloads = async (
  kafka: Kafka,
  messagePayloads: EachMessagePayload[],
): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });
  await consumer.connect();
  await consumer.subscribe({
    topic: config.kafka.kafkaProductsTopic,
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async (payload) => {
      messagePayloads.push(payload);
    },
  })

  return consumer;
}
