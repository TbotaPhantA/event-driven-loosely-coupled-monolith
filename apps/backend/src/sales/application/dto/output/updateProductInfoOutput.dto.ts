import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ProductOutputDto } from './productOutput.dto';

export class UpdateProductInfoOutputDto extends ProductOutputDto {
  static from(product: SalesProduct): UpdateProductInfoOutputDto {
    return new UpdateProductInfoOutputDto(product);
  }
}
