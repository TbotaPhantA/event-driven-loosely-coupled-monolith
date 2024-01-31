import {
  CreateProductBuilder,
} from '../../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { ProductFactory } from '../../../../../../src/sales/domain/product/productFactory';
import { Product } from '../../../../../../src/sales/domain/product/product';
import { CreateProduct } from '../../../../../../src/sales/domain/product/commands/createProduct';
import { RandomService } from '../../../../../../src/infrastructure/random/random.service';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';

const now = new Date(2022, 0, 3);

describe(ProductFactory.name, () => {
  const mockRandomService = mock<RandomService>();
  const mockTimeService = mock<TimeService>();

  describe(ProductFactory.prototype.create.name, () => {
    const testCases = [
      {
        toString: (): string => '1 when phone - should create a phone',
        productId: '01HG1KCX4Z7GGQ0G4NWMFAH4X4',
        name: 'Phone',
        description: 'A android phone',
        price: 500,
      },
      {
        toString: (): string => '2 when laptop - should create a laptop',
        productId: '01HG1MMNZRYYPFBKZDNQ4P08HB',
        name: 'Laptop',
        description: 'Super light laptop',
        price: 1000,
      },
      {
        toString: (): string => '3 when hat - should create a hat',
        productId: '01HG1MRRGZ0TCPAD2ZJ0CPJVR8',
        name: 'Hat',
        description: 'The blue hat',
        price: 10,
      },
    ];

    test.each(testCases)('%s', ({ productId, name, description, price }) => {
      const command = createCommand();
      mockProductIdForRandomService();
      mockNowForTimeService();
      const factory = createFactory();
      const expectedProduct = createExpectedProduct();

      const product = factory.create(command);

      expect(product).toStrictEqual(expectedProduct);

      function createCommand(): CreateProduct {
        return CreateProductBuilder.defaultAll.with({
          name,
          description,
          price,
        }).result;
      }

      function mockProductIdForRandomService(): void {
        mockRandomService.generateULID.mockReturnValue(productId);
      }

      function mockNowForTimeService(): void {
        mockTimeService.now.mockReturnValue(now);
      }

      function createFactory(): ProductFactory {
        return new ProductFactory({
          random: mockRandomService,
          time: mockTimeService,
        });
      }

      function createExpectedProduct(): Product {
        return new Product({
          productId,
          name,
          description,
          price,
          createdAt: now,
          updatedAt: now,
          removedAt: null,
        });
      }
    });
  });
});
