import { InjectionBuilder } from 'ts-fixture-builder';
import { UpdateProductInfo } from '../../../../../src/sales/domain/product/commands/updateProductInfo';

export class UpdateProductInfoBuilder {
  static get defaultAll(): InjectionBuilder<UpdateProductInfo> {
    return new InjectionBuilder<UpdateProductInfo>(UpdateProductInfo.createByRaw({
      productId: 'id',
      name: 'name',
      description: 'description',
    }))
  }
}
