import { InjectionBuilder } from 'ts-fixture-builder';
import { CreateSalesProduct } from '../../../../../src/sales/domain/salesProduct/commands/createSalesProduct';

export class CreateSalesProductBuilder {
  static get defaultAll(): InjectionBuilder<CreateSalesProduct> {
    return new InjectionBuilder<CreateSalesProduct>(
      new CreateSalesProduct('Phone', 'An android phone', 1),
    );
  }
}
