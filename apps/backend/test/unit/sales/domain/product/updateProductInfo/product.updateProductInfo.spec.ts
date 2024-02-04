import { Product } from '../../../../../../src/sales/domain/product/product';
import {
  UpdateProductInfoBuilder
} from '../../../../../shared/__fixtures__/builders/commands/updateProductInfo.builder';
import { ProductBuilder } from '../../../../../shared/__fixtures__/builders/productBuilder';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';
import { ProductInfoUpdated } from '../../../../../../src/sales/domain/product/events/productInfoUpdated';

describe(Product.name, () => {
  const stubTime = mock<TimeService>();

  describe(Product.prototype.updateProductInfo.name, () => {
    const testCases = [
      {
        toString: (): string => '1',
        product: ProductBuilder.defaultAll.with({
          productId: 'productId',
          name: 'name',
          description: 'description',
          updatedAt: new Date(2022, 0, 3),
        }).result,
        command: UpdateProductInfoBuilder.defaultAll.with({
          productId: 'productId',
          name: 'name2',
          description: 'description2',
        }).result,
        now: new Date(2022, 0, 4),
        expectedProduct: ProductBuilder.defaultAll.with({
          productId: 'productId',
          name: 'name2',
          description: 'description2',
          updatedAt: new Date(2022, 0, 4),
        }).result,
      },
    ];

    test.each(testCases)('%s', ({ product, command, now, expectedProduct }) => {
      stubTime.now.mockReturnValue(now);

      product.updateProductInfo(command, { time: stubTime });

      expect(product.export()).toStrictEqual(expectedProduct.export());
    });

    const uncommittedEventsTestCases = [
      {
        toString: (): string => '1',
        product: ProductBuilder.defaultAll.with({
          productId: 'productId',
          name: 'name',
          description: 'description',
          updatedAt: new Date(2022, 0, 3),
        }).result,
        command: UpdateProductInfoBuilder.defaultAll.with({
          productId: 'productId',
          name: 'name2',
          description: 'description2',
        }).result,
        now: new Date(2022, 0, 4),
      }
    ]

    test.each(uncommittedEventsTestCases)('%s', ({ product, command, now }) => {
      const exported = product.export();
      stubTime.now.mockReturnValue(now);
      const expectedEvent = new ProductInfoUpdated({
        productId: exported.productId,
        changes: {
          name: command.name,
          description: command.description,
          updatedAt: now,
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
          name: command.name,
          description: command.description,
          price: exported.price,
          createdAt: exported.createdAt,
          updatedAt: now,
          removedAt: exported.removedAt,
        }
      })

      product.updateProductInfo(command, { time: stubTime });

      expect(product.exportUncommittedEvents()).toStrictEqual([expectedEvent]);
    })
  });
});
