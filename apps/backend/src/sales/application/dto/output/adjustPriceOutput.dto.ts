import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustPriceOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  constructor(raw: NoMethods<AdjustPriceOutputDto>) {
    this.salesProduct = raw.salesProduct;
  }

  static from(product: SalesProduct): AdjustPriceOutputDto {
    const salesProduct = new SalesProductOutputDto(product);
    return new AdjustPriceOutputDto({ salesProduct });
  }
}
