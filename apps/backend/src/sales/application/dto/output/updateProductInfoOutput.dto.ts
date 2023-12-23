import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class UpdateProductInfoOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  constructor(raw: NoMethods<UpdateProductInfoOutputDto>) {
    this.salesProduct = raw.salesProduct;
  }

  static from(product: SalesProduct): UpdateProductInfoOutputDto {
    const salesProduct = new SalesProductOutputDto(product);
    return new UpdateProductInfoOutputDto({ salesProduct });
  }
}
