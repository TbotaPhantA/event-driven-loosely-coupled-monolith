import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class CreateSalesProductOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  constructor(raw: NoMethods<CreateSalesProductOutputDto>) {
    this.salesProduct = raw.salesProduct;
  }

  static from(product: SalesProduct): CreateSalesProductOutputDto {
    const salesProduct = new SalesProductOutputDto(product);
    return new CreateSalesProductOutputDto({ salesProduct });
  }
}
