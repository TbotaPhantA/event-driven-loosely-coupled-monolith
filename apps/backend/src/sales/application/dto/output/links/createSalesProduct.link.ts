import { Link } from './link';
import { createSalesProductResource, salesProductResource } from '../../../sales.controller';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';
import { CreateSalesProduct } from '../../../../domain/salesProduct/commands/createSalesProduct';

export class CreateSalesProductLink extends Link {
  static create(): CreateSalesProductLink {
    return {
      name: CreateSalesProduct.name,
      path: `/${salesProductResource}/${createSalesProductResource}`,
      method: HttpMethodEnum.POST,
    }
  }
}
