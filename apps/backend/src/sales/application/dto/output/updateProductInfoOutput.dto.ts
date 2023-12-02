import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';

export class UpdateProductInfoOutputDto extends SalesProductOutputDto {
  static from(product: SalesProduct): UpdateProductInfoOutputDto {
    return new UpdateProductInfoOutputDto(product);
  }
}
