import { Product } from '../../../../src/sales/domain/product/product';
import { ImportBuilder } from '../../utils/importBuilder';

export class ProductBuilder {
  static get defaultAll(): ImportBuilder<Product> {
    const now = new Date(2022, 0, 3);

    return new ImportBuilder<Product>(
      new Product({
        productId: '01HGNJHGSPJS3QM3ZGMY181ZX4',
        name: 'Phone',
        price: 100,
        description: 'An android phone',
        createdAt: now,
        updatedAt: now,
        removedAt: null,
      })
    );
  }
}
