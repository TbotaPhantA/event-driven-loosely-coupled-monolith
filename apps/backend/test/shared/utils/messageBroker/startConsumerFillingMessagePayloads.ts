import { config } from '../../../../src/infrastructure/config/config';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';

export const startConsumerFillingMessagePayloads = async (messagePayloads: EachMessagePayload[]): Promise<Consumer> => {
  const kafka = createKafka();
  const consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });
  await consumer.connect();
  await consumer.subscribe({
    topic: config.kafka.kafkaSalesProductsTopic,
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async (payload) => {
      messagePayloads.push(payload);
    },
  })

  return consumer;

  function createKafka(): Kafka {
    return new Kafka({
      clientId: 'acceptance-tests',
      brokers: [
        `${config.kafka.kafka1Host}:${config.kafka.kafka1ExternalPort}`,
        `${config.kafka.kafka2Host}:${config.kafka.kafka2ExternalPort}`,
        `${config.kafka.kafka3Host}:${config.kafka.kafka3ExternalPort}`,
      ],
    });
  }
}
