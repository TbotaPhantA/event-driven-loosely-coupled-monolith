import { Link } from './link';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { CreateSalesProduct } from '../../../../domain/salesProduct/commands/createSalesProduct';
import { createSalesProductResource, salesProductResource } from '../../../shared/resources';

export class CreateSalesProductLink extends Link {
  static create(): CreateSalesProductLink {
    return {
      name: CreateSalesProduct.name,
      path: `/${salesProductResource}/${createSalesProductResource}`,
      method: HttpMethodEnum.POST,
    }
  }
}
