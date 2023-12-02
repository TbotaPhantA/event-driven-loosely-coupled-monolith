import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';

export class AdjustPriceOutputDto extends SalesProductOutputDto {
  static from(product: SalesProduct): AdjustPriceOutputDto {
    return new AdjustPriceOutputDto(product);
  }
}
