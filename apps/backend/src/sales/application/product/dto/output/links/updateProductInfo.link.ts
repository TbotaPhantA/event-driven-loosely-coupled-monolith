import { Link } from './link';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { UpdateProductInfo } from '../../../../../domain/product/commands/updateProductInfo';
import { salesProductResource, updateProductInfoResource } from '../../../../shared/resources';
import { config } from '../../../../../../infrastructure/config/config';

export class UpdateProductInfoLink extends Link {
  static from(product: { productId: string }): UpdateProductInfoLink {
    return {
      name: UpdateProductInfo.name,
      origin: config.app.origin,
      path: `/${salesProductResource}/${updateProductInfoResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
