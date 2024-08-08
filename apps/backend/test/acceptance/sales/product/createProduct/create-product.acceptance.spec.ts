import { ProductController } from '../../../../../src/sales/application/product/product.controller';
import { CreateProductBuilder } from '../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';
import { PRODUCT_ALREADY_CREATED } from '../../../../../src/infrastructure/shared/errorMessages';
import { ProductOutputDto } from '../../../../../src/sales/application/product/dto/output/productOutputDto';
import { ProductCreated } from '../../../../../src/sales/domain/product/events/productCreated';
import { MessageTypeEnum } from '../../../../../src/infrastructure/shared/enums/messageType.enum';
import { Product } from '../../../../../src/sales/domain/product/product';
import { SALES_CONTEXT_NAME } from '../../../../../src/sales/application/shared/constants';
import { Requester } from '../../../../shared/utils/requests/requester';
import { MessagesHelper } from '../../../../shared/utils/helpers/messagesHelper';
import { SETUP_TIMEOUT } from '../../../../shared/constants';
import { FixtureHelper } from '../../../../shared/utils/fixtureHelper';
import { SetupManager } from '../../../../shared/utils/setupManager';

describe(`${ProductController.name}`, () => {
  let setupManager: SetupManager;
  let requester: Requester;
  let fixtureHelper: FixtureHelper;
  let messagesHelper: MessagesHelper;
  let correlationId: string;
  let product: ProductOutputDto | undefined;

  beforeAll(async () => {
    setupManager = await SetupManager.beginInitSalesModule();
    requester = setupManager.initRequester();
    fixtureHelper = setupManager.initFixtureHelper();
    messagesHelper = setupManager.initMessagesHelper();
    await setupManager.setupSales();

    correlationId = ulid();
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    await fixtureHelper.cleanupProductDataInDB(product?.productId);
    await setupManager.teardown();
  }, SETUP_TIMEOUT);

  describe(`${ProductController.prototype.createProduct.name}`, () => {
    test(`should return proper response` , async () => {
      const dto = CreateProductBuilder.defaultAll.result;

      const { body, status } = await requester.createProduct({ dto, correlationId });

      expect(status).toStrictEqual(HttpStatus.CREATED);
      expect(body.product.productId).toBeTruthy();
      expect(body.product.createdAt).toBeTruthy();
      expect(body.product.updatedAt).toBeTruthy();
      expect(body.product.removedAt).toStrictEqual(null);
      expect(body.product).toMatchObject({
        name: dto.name,
        price: dto.price,
        description: dto.description,
      });

      product = body.product;
    })

    test('idempotent request with same correlationId - should respond that product is already created', async () => {
      if (!product) return;
      const dto = CreateProductBuilder.defaultAll.result;
      const secondResponse = await requester.createProduct({ dto, correlationId });

      expect(secondResponse.status).toStrictEqual(HttpStatus.CONFLICT)
      expect(secondResponse.body).toMatchObject({
        message: PRODUCT_ALREADY_CREATED,
        product,
      })
    })

    test(`${ProductCreated.name} event - should be sent to broker`, async () => {
      if (!product) return;
      const message = await messagesHelper.getMessageByCorrelationId(correlationId);

      expect(message.key.payload).toStrictEqual(product.productId);
      expect(JSON.parse(message.value.payload).productId).toStrictEqual(product.productId);
      expect(JSON.parse(message.value.payload).changes).toMatchObject(product);
      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: ProductCreated.name,
        correlationId,
        aggregateName: Product.name,
        contextName: SALES_CONTEXT_NAME,
      });
    });
  })
});
