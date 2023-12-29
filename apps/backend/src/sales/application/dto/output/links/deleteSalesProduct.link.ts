import { Link } from './link';
import { SalesProduct } from '../../../../domain/salesProduct/salesProduct';
import { deleteSalesProductResource, salesProductResource } from '../../../sales.controller';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';

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
