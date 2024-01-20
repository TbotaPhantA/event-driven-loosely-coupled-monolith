import { SalesProduct } from '../../../src/sales/domain/salesProduct/salesProduct';
import { ImportBuilder } from '../../shared/utils/importBuilder';

export class SalesProductBuilder {
  static get defaultAll(): ImportBuilder<SalesProduct> {
    const now = new Date(2022, 0, 3);

    return new ImportBuilder<SalesProduct>(
      new SalesProduct({
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
