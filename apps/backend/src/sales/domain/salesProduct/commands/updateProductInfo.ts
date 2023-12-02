import { IsString, Length, MaxLength } from 'class-validator';
import {
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MIN_PRODUCT_NAME_LENGTH,
  ULID_LENGTH,
} from '../../../../infrastructure/shared/constants';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class UpdateProductInfo {
  @IsString()
  @Length(ULID_LENGTH)
  @ApiProperty({ example: '01HGNJHGSPJS3QM3ZGMY181ZX4' })
  productId!: string;

  @IsString()
  @Length(MIN_PRODUCT_NAME_LENGTH, MAX_PRODUCT_NAME_LENGTH)
  @ApiProperty({ example: 'Phone' })
  name!: string;

  @IsString()
  @MaxLength(MAX_PRODUCT_DESCRIPTION_LENGTH)
  @ApiProperty({ example: 'An android phone' })
  description!: string;

  static createByRaw(raw: NoMethods<UpdateProductInfo>): UpdateProductInfo {
    const dto = new UpdateProductInfo();

    dto.name = raw.name;
    dto.description = raw.description;

    return dto;
  }
}
