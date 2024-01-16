import { loadEnvironment } from './utils/loadEnvironment';
loadEnvironment();
import { Kafka } from 'kafkajs';
import { config } from '../src/infrastructure/config/config';
import { inspect } from 'util';

(async (): Promise<void> => {
  const kafka = createKafka();
  const admin = kafka.admin();

  await admin.connect();

  const topics = await admin.listTopics();
  console.log(inspect({ topics }, { depth: 15 }));

  const topic = config.kafka.kafkaSalesProductsTopic;
  const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
  console.log(inspect({ metadata }, { depth: 15 }));

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
