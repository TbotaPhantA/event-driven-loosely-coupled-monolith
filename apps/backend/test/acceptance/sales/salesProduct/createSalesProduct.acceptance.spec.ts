import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app.module';
import { CreateSalesProductBuilder } from '../../../__fixtures__/builders/commands/createSalesProduct.builder';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { TestApiController } from '../../testApi.controller';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { config } from '../../../../src/infrastructure/config/config';
import { waitForMatchingPayload } from '../../../shared/utils/waitForMatchingPayload';
import { extractMessage } from '../../../shared/utils/extractMessage';

describe('SalesProduct', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let consumer: Consumer;
  const messagePayloads = new Array<EachMessagePayload>;

  beforeAll(async () => {
    moduleRef = await createTestingModule().compile()
    app = moduleRef.createNestApplication();
    const kafka = createKafka();
    consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });

    await Promise.all([
      app.init(),
      consumer.connect(),
    ]);
    await consumer.subscribe({
      topic: config.kafka.kafkaSalesProductsTopic,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async (payload) => {
        messagePayloads.push(payload);
      },
    })

    function createTestingModule(): TestingModuleBuilder {
      return Test.createTestingModule({
        controllers: [TestApiController],
        imports: [AppModule],
      })
    }

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
  })

  describe('POST /sales/product/create-sales-product', () => {
    const path = '/sales/product/create-sales-product'
    describe('successfulTestCases', () => {
      const successfulTestCases = [
        {
          toString: (): string => '1 when given valid body - should successfully respond',
          requestBody: CreateSalesProductBuilder.defaultAll.with({
            name: 'Xiaomi',
            price: 500,
            description: 'An android phone',
          }).result,
        },
      ];

      test.each(successfulTestCases)('%s', async ({ requestBody }) => {
        const correlationId = 'correlationId999';

        const { body, status } = await request(app.getHttpServer())
          .post(path)
          .set(CORRELATION_ID_HEADER, correlationId)
          .send(requestBody);

        expect(status).toStrictEqual(HttpStatus.CREATED);
        expect(body.salesProduct).toMatchObject({
          name: requestBody.name,
          price: requestBody.price,
          description: requestBody.description,
        });
      });
    });

    describe('unprocessableTestCases', () => {
      const unprocessableTestCases = [
        {
          toString: (): string => '1 when invalid body - should respond with validation error',
          requestBody: CreateSalesProductBuilder.defaultAll.with({
            // @ts-expect-error intentionally incorrect type
            name: true,
            price: 500,
            description: 'An android phone',
          }).result,
        },
      ]

      test.each(unprocessableTestCases)('%s', async ({ requestBody }) => {
        const { status } = await request(app.getHttpServer()).post(path).send(requestBody);
        expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });

    describe('idempotencyTestCases', () => {
      const testCases = [
        {
          toString: (): string => '1 2 requests same correlationId - should respond that product is already created',
          correlationId: '01HJBWJ82NM47AAG14RV17R2R4',
          requestBody: CreateSalesProductBuilder.defaultAll.with({
            name: 'Xiaomi',
            price: 500,
            description: 'An android phone',
          }).result,
        },
      ];

      test.each(testCases)('%s', async ({ correlationId, requestBody }) => {
        const firstResponse = await request(app.getHttpServer())
          .post(path)
          .set(CORRELATION_ID_HEADER, correlationId)
          .send(requestBody);

        const secondResponse = await request(app.getHttpServer())
          .post(path)
          .set(CORRELATION_ID_HEADER, correlationId)
          .send(requestBody);

        expect(secondResponse.status).toStrictEqual(HttpStatus.CONFLICT)
        expect(secondResponse.body).toMatchObject({
          message: PRODUCT_ALREADY_CREATED,
          salesProduct: firstResponse.body.salesProduct,
        })
      });
    });

    describe('SalesProductCreatedEvent', () => {
      const testCases = [
        {
          toString: (): string => '1 - should be sent to broker',
          correlationId: '01HJBWJ82NM47AAG14RV17R2R4',
          requestBody: CreateSalesProductBuilder.defaultAll.with({
            name: 'Xiaomi',
            price: 500,
            description: 'An android phone',
          }).result,
        },
      ];

      test.each(testCases)('%s', async ({ correlationId, requestBody}) => {
        const response = await request(app.getHttpServer())
          .post(path)
          .set(CORRELATION_ID_HEADER, correlationId)
          .send(requestBody);

        const { value } = extractMessage(await waitForMatchingPayload(messagePayloads, correlationId));
        expect(value).toMatchObject(response.body.salesProduct);
      });
    });
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/test-api/clean-db')
    await moduleRef.close();
    await Promise.all([
      consumer.disconnect(),
      app.close(),
    ])
  })
});
