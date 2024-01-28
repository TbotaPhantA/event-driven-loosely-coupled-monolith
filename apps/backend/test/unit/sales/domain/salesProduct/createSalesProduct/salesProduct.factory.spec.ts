import {
  CreateSalesProductBuilder,
} from '../../../../../shared/__fixtures__/builders/commands/createSalesProduct.builder';
import { SalesProductFactory } from '../../../../../../src/sales/domain/salesProduct/salesProduct.factory';
import { SalesProduct } from '../../../../../../src/sales/domain/salesProduct/salesProduct';
import { CreateSalesProduct } from '../../../../../../src/sales/domain/salesProduct/commands/createSalesProduct';
import { RandomService } from '../../../../../../src/infrastructure/random/random.service';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';

const now = new Date(2022, 0, 3);

describe('SalesProductFactory', () => {
  const mockRandomService = mock<RandomService>();
  const mockTimeService = mock<TimeService>();

  describe('create', () => {
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
      const expectedSalesProduct = createExpectedProduct();

      const product = factory.create(command);

      expect(product).toStrictEqual(expectedSalesProduct);

      function createCommand(): CreateSalesProduct {
        return CreateSalesProductBuilder.defaultAll.with({
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

      function createFactory(): SalesProductFactory {
        return new SalesProductFactory({
          random: mockRandomService,
          time: mockTimeService,
        });
      }

      function createExpectedProduct(): SalesProduct {
        return new SalesProduct({
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
