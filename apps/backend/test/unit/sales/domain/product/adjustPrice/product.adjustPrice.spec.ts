import { ProductBuilder } from '../../../../../shared/__fixtures__/builders/productBuilder';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';
import { AdjustPriceBuilder } from '../../../../../shared/__fixtures__/builders/commands/adjustPrice.builder';
import { Product } from '../../../../../../src/sales/domain/product/product';
import { PriceAdjusted } from '../../../../../../src/sales/domain/product/events/priceAdjusted';

describe(Product.name, () => {
  const now = new Date(2022, 0, 4);
  const stubTime = mock<TimeService>();

  beforeEach(() => {
    stubTime.now.mockReturnValue(now);
  })

  describe(Product.prototype.adjustPrice.name, () => {
    const successfulTestCases = [
      {
        toString: (): string => '1 - price should be properly changed',
        product: ProductBuilder.defaultAll.with({
          price: 500,
          updatedAt: new Date(2022, 0, 3),
        }).result,
        command: AdjustPriceBuilder.defaultAll.with({
          newPrice: 1000,
        }).result,
        expectedProduct: ProductBuilder.defaultAll.with({
          price: 1000,
          updatedAt: now,
        }).result
      },
    ];

    test.each(successfulTestCases)('%s', ({ product, command, expectedProduct }) => {
      product.adjustPrice(command, { time: stubTime });

      expect(product.export()).toStrictEqual(expectedProduct.export());
    });

    const uncommittedEventsTestCases = [
      {
        toString: (): string => `1 after call - should export uncommitted ${PriceAdjusted.name} event`,
        product: ProductBuilder.defaultAll.with({
          productId: 'productId',
          price: 500,
        }).result,
        now: new Date(2022, 0, 4),
        command: AdjustPriceBuilder.defaultAll.with({
          productId: 'productId',
          newPrice: 800,
        }).result,
      }
    ]

    test.each(uncommittedEventsTestCases)('%s', ({ product, now, command}) => {
      stubTime.now.mockReturnValue(now);
      const expectedEvent = new PriceAdjusted({
        productId: command.productId,
        changes: {
          price: command.newPrice,
          updatedAt: now,
        },
        before: product.export(),
        after: {
          ...product.export(),
          price: command.newPrice,
          updatedAt: now,
        },
      });

      product.adjustPrice(command, { time: stubTime });

      expect(product.exportUncommittedEvents()).toStrictEqual([expectedEvent]);
    });
  });
});
