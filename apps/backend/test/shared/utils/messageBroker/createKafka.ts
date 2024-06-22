import { Kafka, logLevel } from 'kafkajs';
import { config } from '../../../../src/infrastructure/config/config';

export const createKafka = (): Kafka => {
    return new Kafka({
      clientId: 'acceptance-tests',
      brokers: [
        `${config.kafka.kafka1Host}:${config.kafka.kafka1ExternalPort}`,
        `${config.kafka.kafka2Host}:${config.kafka.kafka2ExternalPort}`,
        `${config.kafka.kafka3Host}:${config.kafka.kafka3ExternalPort}`,
      ],
      logLevel: logLevel.ERROR,
    });
  }
