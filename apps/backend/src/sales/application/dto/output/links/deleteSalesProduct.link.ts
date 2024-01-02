import { Link } from './link';
import { SalesProduct } from '../../../../domain/salesProduct/salesProduct';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { deleteSalesProductResource, salesProductResource } from '../../../shared/resources';

export class DeleteSalesProductLink extends Link {
  static from(product: Pick<SalesProduct, 'productId'>): DeleteSalesProductLink {
    return {
      name: 'DeleteSalesProduct',
      path: `/${salesProductResource}/${product.productId}/${deleteSalesProductResource}`,
      method: HttpMethodEnum.DELETE,
      id: product.productId,
    }
  }
}
