import { Link } from './link';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { CreateProduct } from '../../../../domain/product/commands/createProduct';
import { createSalesProductResource, salesProductResource } from '../../../shared/resources';

export class CreateProductLink extends Link {
  static create(): CreateProductLink {
    return {
      name: CreateProduct.name,
      path: `/${salesProductResource}/${createSalesProductResource}`,
      method: HttpMethodEnum.POST,
    }
  }
}
