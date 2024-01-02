import { Link } from './link';
import { SalesProduct } from '../../../../domain/salesProduct/salesProduct';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { UpdateProductInfo } from '../../../../domain/salesProduct/commands/updateProductInfo';
import { salesProductResource, updateProductInfoResource } from '../../../shared/resources';

export class UpdateProductInfoLink extends Link {
  static from(product: Pick<SalesProduct, 'productId'>): UpdateProductInfoLink {
    return {
      name: UpdateProductInfo.name,
      path: `/${salesProductResource}/${updateProductInfoResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
