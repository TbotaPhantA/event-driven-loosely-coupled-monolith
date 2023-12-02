import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ProductOutputDto } from './productOutput.dto';

export class CreateSalesProductOutputDto extends ProductOutputDto {
  static from(product: SalesProduct): CreateSalesProductOutputDto {
    return new CreateSalesProductOutputDto(product);
  }
}
