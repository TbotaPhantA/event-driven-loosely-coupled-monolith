import { CreateSalesProductBuilder } from './__fixtures__/builders/createSalesProduct.builder';
import { SalesProductFactory } from '../../../src/sales/domain/salesProduct/salesProduct.factory';
import { createFakeRandomService } from './__fixtures__/fakes/createFakeRandomService';
import { SalesProduct } from '../../../src/sales/domain/salesProduct/salesProduct';
import { CreateSalesProduct } from '../../../src/sales/domain/salesProduct/commands/createSalesProduct';

describe('SalesProductFactory', () => {
  const mockRandomService = createFakeRandomService();

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

      function createFactory(): SalesProductFactory {
        return new SalesProductFactory({
          random: mockRandomService,
        });
      }

      function createExpectedProduct(): SalesProduct {
        return new SalesProduct({
          productId,
          name,
          description,
          price,
        });
      }
    });
  });
});
