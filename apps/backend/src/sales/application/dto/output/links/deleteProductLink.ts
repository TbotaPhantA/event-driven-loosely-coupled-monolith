import { Link } from './link';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { deleteProductResource, salesProductResource } from '../../../shared/resources';

export class DeleteProductLink extends Link {
  static from(product: { productId: string }): DeleteProductLink {
    return {
      name: 'DeleteSalesProduct',
      path: `/${salesProductResource}/${product.productId}/${deleteProductResource}`,
      method: HttpMethodEnum.DELETE,
      id: product.productId,
    }
  }
}
