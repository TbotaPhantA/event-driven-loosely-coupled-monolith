import { SalesProductOutputDto } from './salesProductOutputDto';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';

export class DeleteSalesProductOutputDto extends SalesProductOutputDto {
  static from(product: SalesProduct): DeleteSalesProductOutputDto {
    return new DeleteSalesProductOutputDto(product);
  }
}
