import { Link } from './link';
import { AdjustPrice } from '../../../../domain/product/commands/adjustPrice';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { adjustPriceResource, salesProductResource } from '../../../shared/resources';

export class AdjustPriceLink extends Link {
  static from(product: { productId: string }): AdjustPriceLink {
    return {
      name: AdjustPrice.name,
      path: `/${salesProductResource}/${adjustPriceResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
