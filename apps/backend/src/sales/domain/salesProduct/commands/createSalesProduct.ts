import { IsNumber, IsString, Length, Max, MaxLength, Min } from 'class-validator';
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
  name!: string;

  @IsString()
  @MaxLength(MAX_PRODUCT_DESCRIPTION_LENGTH)
  @ApiProperty({ example: 'An android phone' })
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(MAX_INT_32)
  @ApiProperty({ example: 500 })
  price!: number;

  static createByRaw(raw: NoMethods<CreateSalesProduct>): CreateSalesProduct {
    const dto = new CreateSalesProduct();

    dto.name = raw.name;
    dto.price = raw.price;
    dto.description = raw.description;

    return dto;
  }
}
