import { CreateProduct } from '../../../../../src/sales/domain/product/commands/createProduct';
import { InjectionBuilder } from 'ts-fixture-builder';

export class CreateProductBuilder {
  static get defaultAll(): InjectionBuilder<CreateProduct> {
    return new InjectionBuilder<CreateProduct>(
      CreateProduct.createByRaw({
        name: 'Phone',
        description: 'An android phone',
        price: 1,
      }),
    );
  }
}
