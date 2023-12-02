import { SalesProduct } from '../../../src/sales/domain/salesProduct/salesProduct';
import { NoMethods } from '../../../src/infrastructure/shared/types/noMethods';
import { SalesProductBuilder } from './__fixtures__/builders/salesProduct.builder';
import { AdjustPrice } from '../../../src/sales/domain/salesProduct/commands/adjustPrice';
import { AdjustPriceBuilder } from './__fixtures__/builders/commands/adjustPrice.builder';
import { UpdateProductInfo } from '../../../src/sales/domain/salesProduct/commands/updateProductInfo';
import { UpdateProductInfoBuilder } from './__fixtures__/builders/commands/updateProductInfo.builder';
import { createFakeTimeService } from './__fixtures__/fakes/createFakeTimeService';

const now = new Date(2022, 0, 3);

describe('SalesProduct', () => {
  let mockTimeService = createFakeTimeService();

  beforeEach(() => {
    mockTimeService = createFakeTimeService();
  })

  test('constructor', () => {
    const raw: NoMethods<SalesProduct> = {
      productId: 'ulid',
      name: 'Phone',
      description: 'An android phone',
      price: 500,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    };

    const salesProduct = new SalesProduct(raw);
    const attributes: NoMethods<SalesProduct> = {
      productId: salesProduct.productId,
      price: salesProduct.price,
      name: salesProduct.name,
      description: salesProduct.description,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    };

    expect(attributes).toStrictEqual(raw);
  });

  describe('adjustPrice', () => {
    const testCases = [
      {
        toString: (): string => '1 new price given - should properly adjust the price',
        oldPrice: 500,
        newPrice: 600,
      },
      {
        toString: (): string => '2 new price given - should properly adjust the price',
        oldPrice: 400,
        newPrice: 300,
      },
      {
        toString: (): string => '3 new price given - should properly adjust the price',
        oldPrice: 100,
        newPrice: 900,
      },
    ];

    test.each(testCases)('%s', ({ oldPrice, newPrice }) => {
      const id = 'id';
      const createdAt = new Date(2022, 0, 3);
      const updatedAt = new Date(2022, 0, 4);
      mockTimeService.now = jest.fn().mockReturnValue(updatedAt);
      const salesProduct = createStartingSalesProduct();
      const expectedSalesProduct = createExpectedSalesProduct();
      const command = createCommand();

      salesProduct.adjustPrice(command, { time: mockTimeService });

      expect(salesProduct).toStrictEqual(expectedSalesProduct);

      function createStartingSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          price: oldPrice,
          createdAt,
          updatedAt: createdAt,
        }).result;
      }

      function createExpectedSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          price: newPrice,
          createdAt,
          updatedAt,
        }).result;
      }

      function createCommand(): AdjustPrice {
        return AdjustPriceBuilder.defaultAll.with({
          productId: id,
          newPrice: newPrice,
        }).result;
      }
    });
  });

  describe('updateProductInfo', () => {
    const testCases = [
      {
        toString: (): string => '1 when change name and description - should properly change it',
        oldName: 'oldName',
        oldDescription: 'oldDescription',
        newName: 'newName',
        newDescription: 'newDescription',
      },
    ];

    test.each(testCases)('%s', ({ oldName, oldDescription, newName, newDescription }) => {
      const id = 'id';
      const createdAt = new Date(2022, 0, 3);
      const updatedAt = new Date(2022, 0, 4);
      mockTimeService.now = jest.fn().mockReturnValue(updatedAt);
      const salesProduct = createStartingSalesProduct();
      const expectedProduct = createExpectedSalesProduct();
      const command = createCommand();

      salesProduct.updateProductInfo(command, { time: mockTimeService });

      expect(salesProduct).toStrictEqual(expectedProduct);

      function createStartingSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          name: oldName,
          description: oldDescription,
          createdAt,
          updatedAt: createdAt
        }).result;
      }

      function createExpectedSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          name: newName,
          description: newDescription,
          createdAt,
          updatedAt,
        }).result;
      }

      function createCommand(): UpdateProductInfo {
        return UpdateProductInfoBuilder.defaultAll.with({
          productId: id,
          name: newName,
          description: newDescription,
        }).result;
      }
    });
  });
});
