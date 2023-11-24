import { SalesProduct } from '../../../src/sales/domain/salesProduct/salesProduct';
import { NoMethods } from '../../../src/infrastructure/shared/types/noMethods';

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
});
