import { ProductController } from '../../../../../src/sales/application/product/product.controller';
import { HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';
import { Product, ProductData } from '../../../../../src/sales/domain/product/product';
import { Requester } from '../../../../shared/utils/requests/requester';
import { MessagesHelper } from '../../../../shared/utils/helpers/messagesHelper';
import { SETUP_TIMEOUT } from '../../../../shared/constants';
import { AdjustPriceBuilder } from '../../../../shared/__fixtures__/builders/commands/adjustPrice.builder';
import { FixtureHelper } from '../../../../shared/utils/fixtureHelper';
import { ProductBuilder } from '../../../../shared/__fixtures__/builders/productBuilder';
import { AdjustPrice } from '../../../../../src/sales/domain/product/commands/adjustPrice';
import { MessageTypeEnum } from '../../../../../src/infrastructure/shared/enums/messageType.enum';
import { SALES_CONTEXT_NAME } from '../../../../../src/sales/application/shared/constants';
import { PriceAdjusted } from '../../../../../src/sales/domain/product/events/priceAdjusted';
import { SetupManager } from '../../../../shared/utils/setupManager';

describe(`${ProductController.name}`, () => {
  let setupManager: SetupManager;
  let requester: Requester;
  let fixtureHelper: FixtureHelper;
  let messagesHelper: MessagesHelper;
  let correlationId: string;
  let product: ProductData | undefined;

  beforeAll(async () => {
    setupManager = await SetupManager.beginInitSalesModule();
    requester = setupManager.initRequester();
    fixtureHelper = setupManager.initFixtureHelper();
    messagesHelper = setupManager.initMessagesHelper();
    await setupManager.setup();

    correlationId = ulid();
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    await fixtureHelper.cleanupProductDataInDB(product?.productId);
    await setupManager.teardown();
  }, SETUP_TIMEOUT);

  describe(`${ProductController.prototype.adjustPrice.name}`, () => {
    test(`should return proper response` , async () => {
      product = await fixtureHelper.insertProduct(ProductBuilder.defaultAll.with({
        productId: ulid(),
        price: 100,
      }).result.export());

      const dto = AdjustPriceBuilder.defaultAll.with({
        productId: product.productId,
        newPrice: 500,
      }).result;

      const { body, status } = await requester.adjustPrice({ dto, correlationId });

      expect(status).toStrictEqual(HttpStatus.OK);
      expect(body.product).toMatchObject({
        productId: product.productId,
        name: product.name,
        price: dto.newPrice,
        description: product.description,
        createdAt: product.createdAt.toISOString(),
        removedAt: product.removedAt,
      });
      expect(body.product.updatedAt).not.toStrictEqual(product.updatedAt);

      product = body.product;
    });

    test(`${AdjustPrice.name} event - should be sent to broker`, async () => {
      if (!product) return;
      const message = await messagesHelper.getMessageByCorrelationId(correlationId);

      expect(message.key.payload).toStrictEqual(product.productId);
      expect(JSON.parse(message.value.payload).productId).toStrictEqual(product.productId);
      expect(JSON.parse(message.value.payload).changes).toMatchObject({
        price: product.price,
        updatedAt: product.updatedAt,
      });
      expect(message.headers).toMatchObject({
        messageType: MessageTypeEnum.event,
        messageName: PriceAdjusted.name,
        correlationId,
        aggregateName: Product.name,
        contextName: SALES_CONTEXT_NAME,
      });
    });
  })
});
