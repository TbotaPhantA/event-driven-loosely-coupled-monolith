import { SalesProduct } from '../../../src/sales/domain/salesProduct/salesProduct';
import { NoMethods } from '../../../src/infrastructure/shared/types/noMethods';
import { SalesProductBuilder } from './__fixtures__/builders/salesProduct.builder';
import { AdjustPrice } from '../../../src/sales/domain/salesProduct/commands/adjustPrice';
import { AdjustPriceBuilder } from './__fixtures__/builders/commands/adjustPrice.builder';

describe('SalesProduct', () => {
  test('constructor', () => {
    const raw: NoMethods<SalesProduct> = {
      productId: 'ulid',
      name: 'Phone',
      description: 'An android phone',
      price: 500,
    };

    const salesProduct = new SalesProduct(raw);
    const attributes: NoMethods<SalesProduct> = {
      productId: salesProduct.productId,
      price: salesProduct.price,
      name: salesProduct.name,
      description: salesProduct.description,
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
      const salesProduct = createStartingSalesProduct();
      const expectedSalesProduct = createExpectedSalesProduct();
      const command = createCommand();

      salesProduct.adjustPrice(command);

      expect(salesProduct).toStrictEqual(expectedSalesProduct);

      function createStartingSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          price: oldPrice,
        }).result;
      }

      function createExpectedSalesProduct(): SalesProduct {
        return SalesProductBuilder.defaultAll.with({
          productId: id,
          price: newPrice,
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
});
