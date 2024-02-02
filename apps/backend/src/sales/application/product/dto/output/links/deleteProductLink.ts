import { Link } from './link';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { deleteProductResource, salesProductResource } from '../../../../shared/resources';
import { config } from '../../../../../../infrastructure/config/config';

export class DeleteProductLink extends Link {
  static from(product: { productId: string }): DeleteProductLink {
    return {
      name: 'DeleteSalesProduct',
      origin: config.app.origin,
      path: `/${salesProductResource}/${product.productId}/${deleteProductResource}`,
      method: HttpMethodEnum.DELETE,
      id: product.productId,
    }
  }
}
