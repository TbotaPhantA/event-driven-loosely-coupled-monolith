import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesProductOutputDto {
  @ApiProperty({ example: '01HG1MMNZRYYPFBKZDNQ4P08HB' })
  readonly productId: string;

  @ApiProperty({ example: 'Phone' })
  readonly name: string;

  @ApiProperty({ example: 'An android phone' })
  readonly description: string;

  @ApiProperty({ example: 500 })
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
