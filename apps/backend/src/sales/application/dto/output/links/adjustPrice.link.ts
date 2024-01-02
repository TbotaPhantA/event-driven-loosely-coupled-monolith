import { Link } from './link';
import { SalesProduct } from '../../../../domain/salesProduct/salesProduct';
import { AdjustPrice } from '../../../../domain/salesProduct/commands/adjustPrice';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { adjustPriceResource, salesProductResource } from '../../../shared/resources';

export class AdjustPriceLink extends Link {
  static from(product: Pick<SalesProduct, 'productId'>): AdjustPriceLink {
    return {
      name: AdjustPrice.name,
      path: `/${salesProductResource}/${adjustPriceResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
