import { HttpStatus } from '@nestjs/common';
import { CreateSalesProductBuilder } from '../../../shared/__fixtures__/builders/commands/createSalesProduct.builder';
import * as request from 'supertest';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { waitForMatchingPayload } from '../../../shared/utils/messageBroker/waitForMatchingPayload';
import { extractMessage } from '../../../shared/utils/messageBroker/extractMessage';
import { MessageTypeEnum } from '../../../../src/infrastructure/shared/enums/messageType.enum';
import { SalesProductCreated } from '../../../../src/sales/domain/salesProduct/events/salesProductCreated';
import { SALES_CONTEXT_NAME } from '../../../../src/sales/application/shared/constants';
import { app, messagePayloads, salesEntryLinks } from '../../globalBeforeAndAfterAll';
import { AdjustPriceBuilder } from '../../../shared/__fixtures__/builders/commands/adjustPrice.builder';
import { CreateSalesProductOutputDto } from '../../../../src/sales/application/dto/output/createSalesProductOutput.dto';
import { AdjustPriceOutputDto } from '../../../../src/sales/application/dto/output/adjustPriceOutput.dto';
import { findCreateProductLink } from '../../../shared/utils/links/findCreateProductLink';
import { findAdjustPriceLink } from '../../../shared/utils/links/findAdjustPriceLink';
import { requestCreateProduct } from '../../../shared/utils/requests/requestCreateProduct';

describe(`SalesProductController`, () => {
  let createProductPath: string;
  const correlationId = 'correlationId999';
  const createProductRequestBody = CreateSalesProductBuilder.defaultAll.with({
    name: 'Xiaomi',
    price: 500,
    description: 'An android phone',
  }).result;
  let createProductResponse: CreateSalesProductOutputDto;

  beforeAll(() => {
    createProductPath = findCreateProductLink(salesEntryLinks);
  })

  describe(`POST CreateSalesProduct`, () => {
    test('when given valid body - should successfully respond', async () => {
      const { body, status } = await requestCreateProduct(
        app,
        createProductPath,
        correlationId,
        createProductRequestBody
      );

      expect(status).toStrictEqual(HttpStatus.CREATED);
      expect(body.salesProduct.productId).toBeTruthy();
      expect(body.salesProduct.createdAt).toBeTruthy();
      expect(body.salesProduct.updatedAt).toBeTruthy();
      expect(body.salesProduct.removedAt).toStrictEqual(null);
      expect(body.salesProduct).toMatchObject({
        name: createProductRequestBody.name,
        price: createProductRequestBody.price,
        description: createProductRequestBody.description,
      });

      createProductResponse = body;
    });

    const unprocessableTestCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        requestBody: CreateSalesProductBuilder.defaultAll.with({
          // @ts-expect-error INTENTIONALLY INCORRECT TYPE
          name: true,
          price: 500,
          description: 'An android phone',
        }).result,
      },
    ]

    test.each(unprocessableTestCases)('%s', async ({ requestBody }) => {
      const { status } = await request(app.getHttpServer())
        .post(createProductPath)
        .send(requestBody);

      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    test('idempotent request with same correlationId - should respond that product is already created', async () => {
      const secondResponse = await requestCreateProduct(
        app,
        createProductPath,
        correlationId,
        createProductRequestBody,
      );

      expect(secondResponse.status).toStrictEqual(HttpStatus.CONFLICT)
      expect(secondResponse.body).toMatchObject({
        message: PRODUCT_ALREADY_CREATED,
        salesProduct: createProductResponse.salesProduct,
      })
    })

    test('product created event - should be sent to broker', async () => {
      const message = extractMessage(await waitForMatchingPayload(messagePayloads, correlationId));

      expect(message.key.payload).toStrictEqual(createProductResponse.salesProduct.productId);
      expect(JSON.parse(message.value.payload).product).toMatchObject(createProductResponse.salesProduct);
      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: SalesProductCreated.name,
        correlationId,
        producerName: SALES_CONTEXT_NAME,
      });
    });
  });

  describe(`PUT AdjustPrice`, () => {
    test('successful test cases', async () => {
      const newPrice = createProductResponse.salesProduct.price + 100;
      const adjustPriceRequestBody = AdjustPriceBuilder.defaultAll.with({
        productId: createProductResponse.salesProduct.productId,
        newPrice,
      }).result;

      const { body, status } = await requestAdjustPrice();

      expect(status).toStrictEqual(HttpStatus.OK);
      expect(body.salesProduct).toMatchObject({
        productId: createProductResponse.salesProduct.productId,
        name: createProductResponse.salesProduct.name,
        price: adjustPriceRequestBody.newPrice,
        description: createProductResponse.salesProduct.description,
      });

      function requestAdjustPrice(): Promise<{ body: AdjustPriceOutputDto, status: HttpStatus }> {
        const adjustPricePath = findAdjustPriceLink(createProductResponse.links);
        return request(app.getHttpServer())
          .put(adjustPricePath)
          .send(adjustPriceRequestBody);
      }
    })
  });
});
