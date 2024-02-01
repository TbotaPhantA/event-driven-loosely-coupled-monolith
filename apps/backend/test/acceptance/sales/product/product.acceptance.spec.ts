import { HttpStatus } from '@nestjs/common';
import { CreateProductBuilder } from '../../../shared/__fixtures__/builders/commands/createProduct.builder';
import * as request from 'supertest';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { waitForMatchingPayload } from '../../../shared/utils/messageBroker/waitForMatchingPayload';
import { extractMessage } from '../../../shared/utils/messageBroker/extractMessage';
import { MessageTypeEnum } from '../../../../src/infrastructure/shared/enums/messageType.enum';
import { ProductCreated } from '../../../../src/sales/domain/product/events/productCreated';
import { SALES_CONTEXT_NAME } from '../../../../src/sales/application/shared/constants';
import { app, messagePayloads } from '../../globalBeforeAndAfterAll';
import { AdjustPriceBuilder } from '../../../shared/__fixtures__/builders/commands/adjustPrice.builder';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { findCreateProductPath } from '../../../shared/utils/links/findCreateProductPath';
import { findAdjustPricePath } from '../../../shared/utils/links/findAdjustPricePath';
import { requestCreateProduct } from '../../../shared/utils/requests/requestCreateProduct';
import { requestAdjustPrice } from '../../../shared/utils/requests/requestAdjustPrice';
import { GetSalesEntryLinksOutputDto } from '../../../../src/sales/application/shared/dto/getSalesEntryLinksOutputDto';
import { entryLinksPaths } from '../../../../src/sales/application/shared/paths';
import { Product } from '../../../../src/sales/domain/product/product';
import { ProductController } from '../../../../src/sales/application/product/product.controller';

let salesEntryLinks: GetSalesEntryLinksOutputDto;
let createProductPath: string;
const createProductCorrelationId = 'correlationId999';
const createProductRequestBody = CreateProductBuilder.defaultAll.with({
  name: 'Xiaomi',
  price: 500,
  description: 'An android phone',
}).result;
let createProductResponse: CreateProductOutputDto;

beforeAll(async () => {
  salesEntryLinks = await getSalesEntryLinks();
  createProductPath = findCreateProductPath(salesEntryLinks);

  async function getSalesEntryLinks(): Promise<GetSalesEntryLinksOutputDto> {
    const response = await request(app.getHttpServer())
      .get(entryLinksPaths)
      .send();
    return response.body;
  }
})

describe(ProductController.name, () => {
  describe(ProductController.prototype.createProduct.name, () => {
    test('when given valid body - should successfully respond', async () => {
      const { body, status } = await requestCreateProduct(
        app,
        createProductPath,
        createProductCorrelationId,
        createProductRequestBody
      );

      expect(status).toStrictEqual(HttpStatus.CREATED);
      expect(body.product.productId).toBeTruthy();
      expect(body.product.createdAt).toBeTruthy();
      expect(body.product.updatedAt).toBeTruthy();
      expect(body.product.removedAt).toStrictEqual(null);
      expect(body.product).toMatchObject({
        name: createProductRequestBody.name,
        price: createProductRequestBody.price,
        description: createProductRequestBody.description,
      });

      createProductResponse = body;
    });

    const unprocessableTestCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        requestBody: CreateProductBuilder.defaultAll.with({
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
        createProductCorrelationId,
        createProductRequestBody,
      );

      expect(secondResponse.status).toStrictEqual(HttpStatus.CONFLICT)
      expect(secondResponse.body).toMatchObject({
        message: PRODUCT_ALREADY_CREATED,
        product: createProductResponse.product,
        links: createProductResponse.links,
      })
    })

    test(`${ProductCreated.name} event - should be sent to broker`, async () => {
      const message = extractMessage(await waitForMatchingPayload(messagePayloads, createProductCorrelationId));

      expect(message.key.payload).toStrictEqual(createProductResponse.product.productId);
      expect(JSON.parse(message.value.payload).product).toMatchObject(createProductResponse.product);
      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: ProductCreated.name,
        correlationId: createProductCorrelationId,
        aggregateName: Product.name,
        contextName: SALES_CONTEXT_NAME,
      });
    });
  });

  describe(ProductController.prototype.adjustPrice.name, () => {
    test('successful test cases', async () => {
      const newPrice = createProductResponse.product.price + 100;
      const adjustPriceRequestBody = AdjustPriceBuilder.defaultAll.with({
        productId: createProductResponse.product.productId,
        newPrice,
      }).result;

      const adjustPricePath = findAdjustPricePath(createProductResponse.links);
      const { body, status } = await requestAdjustPrice(
        app,
        adjustPricePath,
        adjustPriceRequestBody,
      );

      expect(status).toStrictEqual(HttpStatus.OK);
      expect(body.product).toMatchObject({
        productId: createProductResponse.product.productId,
        name: createProductResponse.product.name,
        price: adjustPriceRequestBody.newPrice,
        description: createProductResponse.product.description,
      });
    })
  });
});
