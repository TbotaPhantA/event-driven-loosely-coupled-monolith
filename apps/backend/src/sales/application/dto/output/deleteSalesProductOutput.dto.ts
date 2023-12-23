import { SalesProductOutputDto } from './salesProductOutputDto';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class DeleteSalesProductOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  constructor(raw: NoMethods<DeleteSalesProductOutputDto>) {
    this.salesProduct = raw.salesProduct;
  }

  static from(product: SalesProduct): DeleteSalesProductOutputDto {
    const salesProduct = new SalesProductOutputDto(product);
    return new DeleteSalesProductOutputDto({ salesProduct });
  }
}
