import { InjectionBuilder } from 'ts-fixture-builder';
import { SalesProduct } from '../../../../../src/sales/domain/salesProduct/salesProduct';

export class SalesProductBuilder {
  static get defaultAll(): InjectionBuilder<SalesProduct> {
    return new InjectionBuilder<SalesProduct>(
      new SalesProduct({
        productId: '01HGNJHGSPJS3QM3ZGMY181ZX4',
        name: 'Phone',
        price: 100,
        description: 'An android phone',
      }),
    );
  }
}
