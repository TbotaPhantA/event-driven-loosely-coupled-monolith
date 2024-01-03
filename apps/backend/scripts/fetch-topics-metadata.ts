import { Kafka } from 'kafkajs';
import { config } from '../src/infrastructure/config/config';
import { inspect } from 'util';

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
  const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
  console.log(inspect({ metadata }, { depth: 15 }));

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
