import { Product } from '../../../../../../src/sales/domain/product/product';
import { ProductBuilder } from '../../../../../shared/__fixtures__/builders/productBuilder';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';
import { ProductRemoved } from '../../../../../../src/sales/domain/product/events/productRemoved';

describe(Product.name, () => {
  const stubTime = mock<TimeService>();

  describe(Product.prototype.remove.name, () => {
    const testCases = [
      {
        toString: (): string => '1',
        product: ProductBuilder.defaultAll.with({
          productId: 'productId',
          updatedAt: new Date(2022, 0, 3),
          removedAt: null,
        }).result,
        now: new Date(2022, 0, 4),
        expectedProduct: ProductBuilder.defaultAll.with({
          productId: 'productId',
          updatedAt: new Date(2022, 0, 4),
          removedAt: new Date(2022, 0, 4),
        }).result,
      },
    ];

    test.each(testCases)('%s', ({ product, now, expectedProduct }) => {
      stubTime.now.mockReturnValue(now);
      product.remove({ time: stubTime });
      expect(product.export()).toStrictEqual(expectedProduct.export());
    });

    const uncommittedEventsTestCases = [
      {
        toString: (): string => '1',
        product: ProductBuilder.defaultAll.with({
          productId: 'productId',
          updatedAt: new Date(2022, 0, 3),
          removedAt: null,
        }).result,
        now: new Date(2022, 0, 4),
      },
    ];

    test.each(uncommittedEventsTestCases)('%s', ({ product, now }) => {
      stubTime.now.mockReturnValue(now);
      const exported = product.export();
      const expectedEvent = new ProductRemoved({
        productId: exported.productId,
        changes: {
          updatedAt: now,
          removedAt: now,
        },
        before: {
          productId: exported.productId,
          name: exported.name,
          description: exported.description,
          price: exported.price,
          createdAt: exported.createdAt,
          updatedAt: exported.updatedAt,
          removedAt: exported.removedAt,
        },
        after: {
          productId: exported.productId,
          name: exported.name,
          description: exported.description,
          price: exported.price,
          createdAt: exported.createdAt,
          updatedAt: now,
          removedAt: now,
        }
      });

      product.remove({ time: stubTime });

      expect(product.exportUncommittedEvents()).toStrictEqual([expectedEvent]);
    })
  });
});
