import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../../../src/app.module';
import { CreateSalesProductBuilder } from '../../../__fixtures__/builders/commands/createSalesProduct.builder';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';

describe('SalesProduct', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication();

    dataSource = app.get(DataSource);

    await app.init();
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
  });

  afterAll(async () => {
    await dataSource.query(`DELETE FROM sales_product_requests`);
    await dataSource.query(`DELETE FROM sales_products`);
    await moduleRef.close();
    await app.close();
  })
});
