import { HttpStatus } from '@nestjs/common';
import { CreateProductBuilder } from '../../../shared/__fixtures__/builders/commands/createProduct.builder';
import * as request from 'supertest';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { MessageTypeEnum } from '../../../../src/infrastructure/shared/enums/messageType.enum';
import { ProductCreated } from '../../../../src/sales/domain/product/events/productCreated';
import { SALES_CONTEXT_NAME } from '../../../../src/sales/application/shared/constants';
import { app, messagesHelper } from '../../globalBeforeAndAfterAll';
import { AdjustPriceBuilder } from '../../../shared/__fixtures__/builders/commands/adjustPrice.builder';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { findCreateProductPath } from '../../../shared/utils/links/findCreateProductPath';
import { findAdjustPricePath } from '../../../shared/utils/links/findAdjustPricePath';
import { requestCreateProduct } from '../../../shared/utils/requests/requestCreateProduct';
import { requestAdjustPrice } from '../../../shared/utils/requests/requestAdjustPrice';
import { GetSalesEntryLinksOutputDto } from '../../../../src/sales/application/shared/dto/getSalesEntryLinksOutputDto';
import { Product } from '../../../../src/sales/domain/product/product';
import { ProductController } from '../../../../src/sales/application/product/product.controller';
import { AdjustPriceOutputDto } from '../../../../src/sales/application/product/dto/output/adjustPriceOutput.dto';
import { PriceAdjusted } from '../../../../src/sales/domain/product/events/priceAdjusted';
import { AdjustPrice } from '../../../../src/sales/domain/product/commands/adjustPrice';
import { requestUpdateProductInfo } from '../../../shared/utils/requests/requestUpdateProductInfo';
import { UpdateProductInfo } from '../../../../src/sales/domain/product/commands/updateProductInfo';
import {
  UpdateProductInfoOutputDto
} from '../../../../src/sales/application/product/dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfoBuilder } from '../../../shared/__fixtures__/builders/commands/updateProductInfo.builder';
import { findUpdateProductInfoPath } from '../../../shared/utils/links/findUpdateProductInfoPath';
import { requestSalesEntryLinks } from '../../../shared/utils/requests/requestSalesEntryLinks';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';


describe.skip(ProductController.name, () => {
  let salesEntryLinks: GetSalesEntryLinksOutputDto;
  let createProductPath: string;
  let createProductCorrelationId: string;
  let createProductRequestBody: CreateProduct;
  let createProductResponse: CreateProductOutputDto;

  beforeAll(async () => {
    createProductCorrelationId = 'correlationId999';
    createProductRequestBody = CreateProductBuilder.defaultAll.with({
      name: 'Xiaomi',
      price: 500,
      description: 'An android phone',
    }).result;
    salesEntryLinks = await requestSalesEntryLinks();
    createProductPath = findCreateProductPath(salesEntryLinks);
  });

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
      const message = await messagesHelper.getMessageByCorrelationId(createProductCorrelationId);

      expect(message.key.payload).toStrictEqual(createProductResponse.product.productId);
      expect(JSON.parse(message.value.payload).productId).toStrictEqual(createProductResponse.product.productId);
      expect(JSON.parse(message.value.payload).changes).toMatchObject(createProductResponse.product);
      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: ProductCreated.name,
        correlationId: createProductCorrelationId,
        aggregateName: Product.name,
        contextName: SALES_CONTEXT_NAME,
      });
    }, 15000);
  });

  describe(ProductController.prototype.adjustPrice.name, () => {
    let adjustPricePath: string;
    const adjustPriceCorrelationId: string = 'someAdjustPriceCorrelationId';
    let adjustPriceRequestBody: AdjustPrice;
    beforeAll(() => {
      adjustPricePath = findAdjustPricePath(createProductResponse.links);
      adjustPriceRequestBody = AdjustPriceBuilder.defaultAll.with({
        productId: createProductResponse.product.productId,
        newPrice: createProductResponse.product.price + 100,
      }).result;
    })
    let adjustPriceResponse: AdjustPriceOutputDto;

    test('successful test case', async () => {
      const { body, status } = await requestAdjustPrice(
        app,
        adjustPricePath,
        adjustPriceCorrelationId,
        adjustPriceRequestBody,
      );

      expect(status).toStrictEqual(HttpStatus.OK);
      expect(body.product).toMatchObject({
        productId: createProductResponse.product.productId,
        name: createProductResponse.product.name,
        price: adjustPriceRequestBody.newPrice,
        description: createProductResponse.product.description,
      });
      adjustPriceResponse = body;
    })

    const unprocessableTestCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        requestBody: AdjustPriceBuilder.defaultAll.with({
          productId: 'productId',
          newPrice: -100,
        }).result,
      },
    ]

    test.each(unprocessableTestCases)('%s', async ({ requestBody }) => {
      const { status } = await requestAdjustPrice(
        app,
        adjustPricePath,
        adjustPriceCorrelationId,
        requestBody,
      );

      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    test('event should be sent to broker', async () => {
      const message = await messagesHelper.getMessageByCorrelationId(adjustPriceCorrelationId);
      const keyPayload = message.key.payload
      const valuePayload = JSON.parse(message.value.payload)

      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: PriceAdjusted.name,
        correlationId: adjustPriceCorrelationId,
        aggregateName: Product.name,
        contextName: SALES_CONTEXT_NAME,
      });
      expect(keyPayload).toStrictEqual(adjustPriceResponse.product.productId);
      expect(valuePayload).toMatchObject({
        productId: adjustPriceResponse.product.productId,
        changes: {
          price: adjustPriceResponse.product.price,
          updatedAt: adjustPriceResponse.product.updatedAt,
        },
        before: createProductResponse.product,
        after: adjustPriceResponse.product,
      });
    }, 15000)
  });

  describe(`${ProductController.prototype.updateProductInfo.name}`, () => {
    let updateProductInfoPath: string;
    const updateProductInfoCorrelationId: string = 'someAdjustPriceCorrelationId';
    let updateProductInfoRequestBody: UpdateProductInfo;

    beforeAll(() => {
      updateProductInfoPath = findUpdateProductInfoPath(createProductResponse.links);
      updateProductInfoRequestBody = UpdateProductInfoBuilder.defaultAll.with({
        productId: createProductResponse.product.productId,
        name: 'name2',
        description: 'description2',
      }).result;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let updateProductInfoResponse: UpdateProductInfoOutputDto;

    test('successful test case', async () => {
      const { body, status } = await requestUpdateProductInfo(
        app,
        updateProductInfoPath,
        updateProductInfoCorrelationId,
        updateProductInfoRequestBody,
      );
      // findUpdateProductInfoPath

      expect(status).toStrictEqual(HttpStatus.OK);
      expect(body.product).toMatchObject({
        productId: createProductResponse.product.productId,
        name: updateProductInfoRequestBody.name,
        price: createProductResponse.product.price + 100,
        description: updateProductInfoRequestBody.description,
      })
      updateProductInfoResponse = body;
    })

    test('invalid body test case', async () => {
      const requestBody = UpdateProductInfoBuilder.defaultAll.with({
        productId: createProductResponse.product.productId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        name: 2,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        description: 3,
      }).result;

      const { status } = await requestUpdateProductInfo(
        app,
        updateProductInfoPath,
        updateProductInfoCorrelationId,
        requestBody,
      );

      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    })

    // TODO: event should be sent to broker
  });
});
