import { InjectionBuilder } from 'ts-fixture-builder';
import { ProductCreated } from '../../../../../src/sales/domain/product/events/productCreated';
import { ProductBuilder } from '../productBuilder';

export class ProductCreatedBuilder {
  static get defaultAll(): InjectionBuilder<ProductCreated> {
    const exported = ProductBuilder.defaultAll.result.export();

    return new InjectionBuilder<ProductCreated>(
      new ProductCreated({ data: { product: exported } }),
    );
  }
}
