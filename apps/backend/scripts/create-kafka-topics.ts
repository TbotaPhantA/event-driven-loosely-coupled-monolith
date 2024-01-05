import * as dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import { config } from '../src/infrastructure/config/config';

dotenv.config({ path: '.env.test.local' });


(async (): Promise<void> => {
  const kafka = createKafka();
  const admin = kafka.admin();

  await admin.connect();

  const toCreateTopics = [config.kafka.kafkaSalesProductsTopic];

  const areTopicsCreated = await admin.createTopics({
    topics: toCreateTopics.map(topic => ({
      topic,
      numPartitions: 3,
      replicationFactor: 3,
    })),
  });

  if (areTopicsCreated) {
    console.log(`topics ${toCreateTopics} are successfully created`);
  }

  await admin.disconnect();

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
