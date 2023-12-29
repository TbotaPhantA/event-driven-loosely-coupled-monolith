import { Link } from './link';
import { SalesProduct } from '../../../../domain/salesProduct/salesProduct';
import { AdjustPrice } from '../../../../domain/salesProduct/commands/adjustPrice';
import { adjustPriceResource, salesProductResource } from '../../../sales.controller';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';

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
