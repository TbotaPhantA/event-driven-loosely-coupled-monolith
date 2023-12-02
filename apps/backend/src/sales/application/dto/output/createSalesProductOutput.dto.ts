import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';

export class CreateSalesProductOutputDto extends SalesProductOutputDto {
  static from(product: SalesProduct): CreateSalesProductOutputDto {
    return new CreateSalesProductOutputDto(product);
  }
}
