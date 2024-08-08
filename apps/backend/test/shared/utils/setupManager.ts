/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedAssignment
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Requester } from './requests/requester';
import { FixtureHelper } from './fixtureHelper';
import { DataSource } from 'typeorm';
import { MessagesHelper } from './helpers/messagesHelper';
import { assertIsNotUndefined } from './isNotUndefined';
import { io, Socket } from 'socket.io-client';
import { config } from '../../../src/infrastructure/config/config';
import { Partitioners, Producer } from 'kafkajs';
import { createKafka } from './messageBroker/createKafka';
import { Transport } from '@nestjs/microservices';
import { ulid } from 'ulid';
import { SalesTestModule } from '../testModules/salesTest.module';
import { StorageTestModule } from '../testModules/storageTest.module';

export class SetupManager {
  private __moduleRef?: TestingModule;
  private __app?: NestFastifyApplication;
  private __requester?: Requester;
  private __fixtureHelper?: FixtureHelper;
  private __messagesHelper?: MessagesHelper;
  private __socket?: Socket<any>;
  private __producer?: Producer;

  get moduleRef(): TestingModule {
    assertIsNotUndefined(this.__moduleRef);
    return this.__moduleRef;
  }

  get app(): NestFastifyApplication {
    assertIsNotUndefined(this.__app);
    return this.__app;
  }

  get requester(): Requester {
    assertIsNotUndefined(this.__requester);
    return this.__requester;
  }

  get fixtureHelper(): FixtureHelper {
    assertIsNotUndefined(this.__fixtureHelper);
    return this.__fixtureHelper;
  }

  get messagesHelper(): MessagesHelper {
    assertIsNotUndefined(this.__messagesHelper);
    return this.__messagesHelper;
  }

  get socket(): Socket<any> {
    assertIsNotUndefined(this.__socket);
    return this.__socket;
  }

  get producer(): Producer {
    assertIsNotUndefined(this.__producer);
    return this.__producer;
  }


  initRequester(): Requester {
    this.__requester = new Requester(this.app);
    return this.requester;
  }

  initFixtureHelper(): FixtureHelper {
    this.__fixtureHelper = new FixtureHelper(this.app.get(DataSource));
    return this.fixtureHelper;
  }

  initMessagesHelper(): MessagesHelper {
    this.__messagesHelper = new MessagesHelper();
    return this.messagesHelper;
  }

  initSocket(origin: string): Socket<any> {
    this.__socket = io(origin);
    return this.socket;
  }

  initProducer(): Producer {
    const kafka = createKafka();

    this.__producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    return this.producer;
  }

  static async beginInitSalesModule(): Promise<SetupManager> {
    const builder = new SetupManager();

    builder.__moduleRef = await Test.createTestingModule({
      imports: [SalesTestModule],
    }).compile();
    builder.__app = builder.moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    return builder
  }

  static async beginInitStorageModule(): Promise<SetupManager> {
    const builder = new SetupManager();

    builder.__moduleRef = await Test.createTestingModule({
      imports: [StorageTestModule],
    }).compile();
    builder.__app = builder.moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    return builder
  }

  async setupStorage(port?: number): Promise<void> {
    this.app.connectMicroservice({
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
          groupId: ulid(),
        },
      },
    }, { inheritAppConfig: true });

    await this.app.startAllMicroservices();

    await Promise.all([
      port ? this.__app?.listen(port) : this.__app?.init(),
      this.__messagesHelper?.startConsumerFillingMessagePayloads(),
      this.__producer?.connect(),
    ]);
    await this.__app?.getHttpAdapter()?.getInstance()?.ready();
  }

  async setupSales(): Promise<void> {
    await Promise.all([
      this.__app?.init(),
      this.__messagesHelper?.startConsumerFillingMessagePayloads(),
      this.__producer?.connect(),
    ]);
    await this.__app?.getHttpAdapter()?.getInstance()?.ready();
  }

  async teardown(): Promise<void> {
    await Promise.all([
      this.__producer?.disconnect(),
      this.__socket?.disconnect(),
      this.__messagesHelper?.stopConsumer(),
      this.__moduleRef?.close(),
    ])
    await this.__app?.close();
  }
}
