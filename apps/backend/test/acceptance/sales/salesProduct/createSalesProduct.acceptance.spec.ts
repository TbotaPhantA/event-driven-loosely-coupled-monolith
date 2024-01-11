import { HttpStatus } from '@nestjs/common';
import { CreateSalesProductBuilder } from '../../../__fixtures__/builders/commands/createSalesProduct.builder';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { waitForMatchingPayload } from '../../../shared/utils/waitForMatchingPayload';
import { extractMessage } from '../../../shared/utils/extractMessage';
import { createSalesProductResource, salesProductResource } from '../../../../src/sales/application/shared/resources';
import { MessageTypeEnum } from '../../../../src/infrastructure/shared/enums/messageType.enum';
import { SalesProductCreated } from '../../../../src/sales/domain/salesProduct/events/salesProductCreated';
import { SALES_CONTEXT_NAME } from '../../../../src/sales/application/shared/constants';
import { app, messagePayloads } from '../../globalBeforeAndAfterAll';

describe('/sales/product', () => {
  describe(`POST /${salesProductResource}/${createSalesProductResource}`, () => {
    const path = `/${salesProductResource}/${createSalesProductResource}`
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
          toString: (): string => '2 requests same correlationId - should respond that product is already created',
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

        const message = extractMessage(await waitForMatchingPayload(messagePayloads, correlationId));

        expect(message.key.payload).toStrictEqual(response.body.salesProduct.productId);
        expect(JSON.parse(message.value.payload)).toMatchObject(response.body.salesProduct);
        expect(message.headers).toMatchObject({
          messageType: MessageTypeEnum.event,
          messageName: SalesProductCreated.name,
          correlationId,
          producerName: SALES_CONTEXT_NAME,
        });
      });
    });
  });
});
