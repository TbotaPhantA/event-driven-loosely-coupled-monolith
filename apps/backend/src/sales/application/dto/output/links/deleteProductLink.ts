import { Link } from './link';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { deleteSalesProductResource, salesProductResource } from '../../../shared/resources';

export class DeleteProductLink extends Link {
  static from(product: { productId: string }): DeleteProductLink {
    return {
      name: 'DeleteSalesProduct',
      path: `/${salesProductResource}/${product.productId}/${deleteSalesProductResource}`,
      method: HttpMethodEnum.DELETE,
      id: product.productId,
    }
  }
}
