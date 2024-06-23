/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedAssignment
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../../../src/app.module';
import { Requester } from './requests/requester';
import { FixtureHelper } from './fixtureHelper';
import { DataSource } from 'typeorm';
import { MessagesHelper } from './helpers/messagesHelper';
import { assertIsNotUndefined } from './isNotUndefined';

export class SetupManager {
  private __moduleRef?: TestingModule;
  private __app?: NestFastifyApplication;
  private __requester?: Requester;
  private __fixtureHelper?: FixtureHelper;
  private __messagesHelper?: MessagesHelper;

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

  static async beginInitialization(): Promise<SetupManager> {
    const builder = new SetupManager();

    builder.__moduleRef = await Test.createTestingModule({
      controllers: [],
      imports: [AppModule],
    }).compile();
    builder.__app = builder.moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    return builder
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

  async setup(): Promise<void> {
    await Promise.all([
      this.__app?.init(),
      this.__messagesHelper?.startConsumerFillingMessagePayloads()
    ]);
    await this.__app?.getHttpAdapter()?.getInstance()?.ready();
  }

  async teardown(): Promise<void> {
    await Promise.all([
      this.__messagesHelper?.stopConsumer(),
      this.__moduleRef?.close(),
    ])
    await this.__app?.close();
  }
}
