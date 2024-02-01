import { Product } from '../../../../../../src/sales/domain/product/product';
import { CreateProductBuilder } from '../../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { ProductBuilder } from '../../../../../shared/__fixtures__/builders/productBuilder';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { RandomService } from '../../../../../../src/infrastructure/random/random.service';
import { mock } from 'jest-mock-extended';
import { ProductCreated } from '../../../../../../src/sales/domain/product/events/productCreated';

describe(Product.name, () => {
  const stubTime = mock<TimeService>();
  const stubRandom = mock<RandomService>();

  describe(Product['create'].name, () => {
    const successfulTestCases = [
      {
        toString: (): string => '1 when proper data is given - should successfully create a product',
        productId: '01HNGH0MYN74N7T47GBZD158V5',
        now: new Date(2022, 0, 3),
        command: CreateProductBuilder.defaultAll.with({
          name: 'Xiaomi',
          price: 500,
          description: 'An android phone',
        }).result,
      },
    ];

    test.each(successfulTestCases)('%s', ({ productId, now, command }) => {
      const expectedProduct = ProductBuilder.defaultAll.with({
        productId: productId,
        name: command.name,
        price: command.price,
        description: command.description,
        createdAt: now,
        updatedAt: now,
        removedAt: null,
      }).result;
      const deps = {
        time: stubTime,
        random: stubRandom
      } satisfies Parameters<typeof Product['create']>[1];
      stubTime.now.mockReturnValue(now);
      stubRandom.generateULID.mockReturnValue(productId);

      const resultProduct = Product.create(command, deps);

      expect(resultProduct.export()).toStrictEqual(expectedProduct.export());
    });

    const uncommittedEventsTestCases = [
      {
        toString: (): string =>
          `1 uncommittedEventsTestCases after creation - should export ${ProductCreated.name} event`,
        productId: '01HNGH0MYN74N7T47GBZD158V5',
        now: new Date(2022, 0, 3),
        command: CreateProductBuilder.defaultAll.with({
          name: 'Xiaomi',
          price: 500,
          description: 'An android phone',
        }).result,
      }
    ]

    test.each(uncommittedEventsTestCases)('%s', ({ productId, now, command }) => {
      const expectedProduct = ProductBuilder.defaultAll.with({
        productId: productId,
        name: command.name,
        price: command.price,
        description: command.description,
        createdAt: now,
        updatedAt: now,
        removedAt: null,
      }).result;
      const deps = {
        time: stubTime,
        random: stubRandom
      } satisfies Parameters<typeof Product['create']>[1];
      stubTime.now.mockReturnValue(now);
      stubRandom.generateULID.mockReturnValue(productId);
      const expectedEvents = [new ProductCreated({ data: { product: expectedProduct.export() } })];

      const resultProduct = Product.create(command, deps);

      expect(resultProduct.exportUncommittedEvents()).toStrictEqual(expectedEvents);
    });
  });
});
