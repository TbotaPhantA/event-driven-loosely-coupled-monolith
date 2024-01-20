import { SalesProduct } from '../../../../../../src/sales/domain/salesProduct/salesProduct';

describe('SalesProduct', () => {
  test('constructor', () => {
    const now = new Date(2022, 0, 3);
    const [data]: ConstructorParameters<typeof SalesProduct> = [
      {
        productId: '01HGNJHGSPJS3QM3ZGMY181ZX4',
        name: 'Phone',
        price: 100,
        description: 'An android phone',
        createdAt: now,
        updatedAt: now,
        removedAt: null,
      },
    ];

    const product = new SalesProduct(data);
    expect(product.export()).toStrictEqual(data);
  })
});
