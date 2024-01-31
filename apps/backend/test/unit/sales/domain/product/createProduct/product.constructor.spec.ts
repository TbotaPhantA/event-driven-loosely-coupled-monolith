import { Product } from '../../../../../../src/sales/domain/product/product';

describe('Product', () => {
  test('constructor', () => {
    const now = new Date(2022, 0, 3);
    const [data]: ConstructorParameters<typeof Product> = [
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

    const product = new Product(data);
    expect(product.export()).toStrictEqual(data);
  })
});
