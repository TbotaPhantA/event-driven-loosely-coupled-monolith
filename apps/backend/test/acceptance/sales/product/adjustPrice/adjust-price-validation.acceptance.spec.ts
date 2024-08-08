import { ProductController } from '../../../../../src/sales/application/product/product.controller';
import { SetupManager } from '../../../../shared/utils/setupManager';
import { Requester } from '../../../../shared/utils/requests/requester';
import { SETUP_TIMEOUT } from '../../../../shared/constants';
import { HttpStatus } from '@nestjs/common';
import { AdjustPriceBuilder } from '../../../../shared/__fixtures__/builders/commands/adjustPrice.builder';

describe(`${ProductController.name} validation`, () => {
  let setupManager: SetupManager;
  let requester: Requester;

  beforeAll(async () => {
    setupManager = await SetupManager.beginInitSalesModule();
    requester = setupManager.initRequester();
    await setupManager.setupSales();
  }, SETUP_TIMEOUT)

  afterAll(async () => {
    await setupManager.teardown();
  }, SETUP_TIMEOUT)

  describe(`${ProductController.prototype.adjustPrice.name} validation`, () => {
    const testCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        dto: AdjustPriceBuilder.defaultAll.with({
          newPrice: -10,
        }).result,
      },
    ]

    test.each(testCases)('%s', async ({ dto }) => {
      const { status } = await requester.adjustPrice({ dto });
      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  })
});
