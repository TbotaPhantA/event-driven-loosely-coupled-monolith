import { Link } from './link';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { CreateProduct } from '../../../../../domain/product/commands/createProduct';
import { createProductResource, salesProductResource } from '../../../../shared/resources';
import { config } from '../../../../../../infrastructure/config/config';

export class CreateProductLink extends Link {
  static create(): CreateProductLink {
    return {
      name: CreateProduct.name,
      origin: config.app.origin,
      path: `/${salesProductResource}/${createProductResource}`,
      method: HttpMethodEnum.POST,
    }
  }
}
