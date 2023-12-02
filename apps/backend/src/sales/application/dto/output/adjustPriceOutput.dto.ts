import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ProductOutputDto } from './productOutput.dto';

export class AdjustPriceOutputDto extends ProductOutputDto {
  static from(product: SalesProduct): AdjustPriceOutputDto {
    return new AdjustPriceOutputDto(product);
  }
}
