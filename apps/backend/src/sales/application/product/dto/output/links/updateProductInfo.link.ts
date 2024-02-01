import { Link } from './link';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { UpdateProductInfo } from '../../../../../domain/product/commands/updateProductInfo';
import { salesProductResource, updateProductInfoResource } from '../../../../shared/resources';

export class UpdateProductInfoLink extends Link {
  static from(product: { productId: string }): UpdateProductInfoLink {
    return {
      name: UpdateProductInfo.name,
      path: `/${salesProductResource}/${updateProductInfoResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
