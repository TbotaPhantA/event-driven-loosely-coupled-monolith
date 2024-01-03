import { Kafka } from 'kafkajs';
import { config } from '../src/infrastructure/config/config';

(async (): Promise<void> => {
  const kafka = createKafka();

  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });
  const admin = kafka.admin();

  await Promise.all([
    producer.connect(),
    consumer.connect(),
    admin.connect(),
  ]);
  const topic = config.kafka.kafkaSalesProductsTopic;

  const isTopicCreated = await admin.createTopics({ topics: [{
    topic,
    numPartitions: 3,
    replicationFactor: 3,
  }] });

  console.log({ isTopicCreated });

  await Promise.all([
    producer.disconnect(),
    consumer.disconnect(),
    admin.disconnect(),
  ])

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
})();
