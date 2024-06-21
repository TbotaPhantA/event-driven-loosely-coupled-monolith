import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Consumer, Kafka, Partitioners, Producer } from 'kafkajs';
import { TestApiController } from './testApi.controller';
import { AppModule } from '../../src/app.module';
import { createKafka } from '../shared/utils/messageBroker/createKafka';
import { config } from '../../src/infrastructure/config/config';
import { Requester } from '../shared/utils/requests/requester';
import { Cleaner } from '../shared/utils/cleaner';
import { DataSource } from 'typeorm';
import { Transport } from '@nestjs/microservices';
import { MessagesHelper } from '../shared/utils/helpers/messagesHelper';

let moduleRef: TestingModule;
let consumer: Consumer;
export let app: INestApplication;
export let messagesHelper: MessagesHelper;
export let kafka: Kafka;
export let producer: Producer;
export let requester: Requester;
export let cleaner: Cleaner;

beforeAll(async () => {
  moduleRef = await Test.createTestingModule({
    controllers: [TestApiController],
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  messagesHelper = new MessagesHelper();
  kafka = createKafka();
  producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [
          `${config.kafka.kafka1Host}:${config.kafka.kafka1ExternalPort}`,
          `${config.kafka.kafka2Host}:${config.kafka.kafka2ExternalPort}`,
          `${config.kafka.kafka3Host}:${config.kafka.kafka3ExternalPort}`,
        ],
        connectionTimeout: 10000,
      },
      consumer: {
        groupId: config.kafka.consumerGroup,
      },
    },
  }, { inheritAppConfig: true });

  await app.startAllMicroservices();

  const [,startedConsumer] = await Promise.all([
    app.listen(config.app.port),
    messagesHelper.startConsumerFillingMessagePayloads(kafka),
    producer.connect(),
  ])

  consumer = startedConsumer;
  requester = new Requester(app);
  cleaner = new Cleaner(app.get(DataSource));
}, 30000);

afterAll(async () => {
  await Promise.all([
    moduleRef.close(),
    consumer.stop(),
  ])
  await Promise.all([
    consumer.disconnect(),
    producer.disconnect(),
    app.close(),
  ])
}, 30000);
