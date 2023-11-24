import {
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import {
  MAX_INT_32,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MIN_PRODUCT_NAME_LENGTH,
} from '../../../../infrastructure/shared/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesProduct {
  @IsString()
  @Length(MIN_PRODUCT_NAME_LENGTH, MAX_PRODUCT_NAME_LENGTH)
  @ApiProperty({ example: 'Phone' })
  readonly name: string;

  @IsString()
  @MaxLength(MAX_PRODUCT_DESCRIPTION_LENGTH)
  @ApiProperty({ example: 'An android phone' })
  readonly description: string;

  @IsNumber()
  @Min(0)
  @Max(MAX_INT_32)
  @ApiProperty({ example: 500 })
  readonly price: number;

  constructor(raw: NoMethods<CreateSalesProduct>) {
    this.name = raw?.name;
    this.description = raw?.description;
    this.price = raw?.price;
  }
}
