import { Link } from './link';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { deleteSalesProductResource, salesProductResource } from '../../../shared/resources';

export class DeleteSalesProductLink extends Link {
  static from(product: { productId: string }): DeleteSalesProductLink {
    return {
      name: 'DeleteSalesProduct',
      path: `/${salesProductResource}/${product.productId}/${deleteSalesProductResource}`,
      method: HttpMethodEnum.DELETE,
      id: product.productId,
    }
  }
}
