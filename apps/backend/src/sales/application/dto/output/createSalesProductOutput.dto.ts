import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesProductOutputDto {
  @ApiProperty()
  readonly productId: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly price: number;

  constructor(raw: NoMethods<CreateSalesProductOutputDto>) {
    this.productId = raw.productId;
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
  }

  static from(product: SalesProduct): CreateSalesProductOutputDto {
    return new CreateSalesProductOutputDto(product);
  }
}
