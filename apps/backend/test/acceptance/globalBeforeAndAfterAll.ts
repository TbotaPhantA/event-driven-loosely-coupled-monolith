import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { startConsumerFillingMessagePayloads } from '../shared/utils/startConsumerFillingMessagePayloads';
import { TestApiController } from './testApi.controller';
import { AppModule } from '../../src/app.module';
import { GetEntryLinksOutputDto } from '../../src/sales/application/dto/output/getEntryLinksOutput.dto';
import { entryLinksPaths } from '../../src/sales/application/shared/paths';
import * as request from 'supertest';

let moduleRef: TestingModule;
let consumer: Consumer;
export let app: INestApplication;
export const messagePayloads = new Array<EachMessagePayload>;
export let salesEntryLinks: GetEntryLinksOutputDto;

beforeAll(async () => {
  moduleRef = await createTestingModule().compile()
  app = moduleRef.createNestApplication();
  const [,startedConsumer] = await Promise.all([
    app.init(),
    startConsumerFillingMessagePayloads(messagePayloads),
  ])
  salesEntryLinks = await getEntryLinks();
  consumer = startedConsumer;

  function createTestingModule(): TestingModuleBuilder {
    return Test.createTestingModule({
      controllers: [TestApiController],
      imports: [AppModule],
    })
  }

  async function getEntryLinks(): Promise<GetEntryLinksOutputDto> {
    const response = await request(app.getHttpServer())
      .get(entryLinksPaths)
      .send();
    return response.body;
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
