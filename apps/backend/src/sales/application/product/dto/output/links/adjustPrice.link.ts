import { Link } from './link';
import { AdjustPrice } from '../../../../../domain/product/commands/adjustPrice';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { adjustPriceResource, salesProductResource } from '../../../../shared/resources';
import { config } from '../../../../../../infrastructure/config/config';

export class AdjustPriceLink extends Link {
  static from(product: { productId: string }): AdjustPriceLink {
    return {
      name: AdjustPrice.name,
      origin: config.app.origin,
      path: `/${salesProductResource}/${adjustPriceResource}`,
      method: HttpMethodEnum.PUT,
      id: product.productId,
    }
  }
}
