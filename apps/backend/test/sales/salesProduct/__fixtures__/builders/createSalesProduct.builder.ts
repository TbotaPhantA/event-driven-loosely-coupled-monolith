import { InjectionBuilder } from 'ts-fixture-builder';
import { CreateSalesProduct } from '../../../../../src/sales/domain/salesProduct/commands/createSalesProduct';

export class CreateSalesProductBuilder {
  static get defaultAll(): InjectionBuilder<CreateSalesProduct> {
    return new InjectionBuilder<CreateSalesProduct>(
      CreateSalesProduct.createByRaw({
        name: 'Phone',
        description: 'An android phone',
        price: 1,
      }),
    );
  }
}
