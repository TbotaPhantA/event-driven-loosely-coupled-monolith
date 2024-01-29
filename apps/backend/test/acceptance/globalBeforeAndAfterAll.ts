import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { startConsumerFillingMessagePayloads } from '../shared/utils/messageBroker/startConsumerFillingMessagePayloads';
import { TestApiController } from './testApi.controller';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

let moduleRef: TestingModule;
let consumer: Consumer;
export let app: INestApplication;
export const messagePayloads = new Array<EachMessagePayload>;

beforeAll(async () => {
  moduleRef = await createTestingModule().compile();
  app = moduleRef.createNestApplication();
  const [,startedConsumer] = await Promise.all([
    app.init(),
    startConsumerFillingMessagePayloads(messagePayloads),
  ])
  consumer = startedConsumer;

  function createTestingModule(): TestingModuleBuilder {
    return Test.createTestingModule({
      controllers: [TestApiController],
      imports: [AppModule],
    })
  }

}, 30000);

afterAll(async () => {
  await request(app.getHttpServer()).post('/test-api/clean-db')
  await Promise.all([
    moduleRef.close(),
    consumer.stop(),
  ])
  await Promise.all([
    consumer.disconnect(),
    app.close(),
  ])
}, 30000);
