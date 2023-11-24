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

export class CreateSalesProduct {
  @IsString()
  @Length(MIN_PRODUCT_NAME_LENGTH, MAX_PRODUCT_NAME_LENGTH)
  public readonly name: string;

  @IsString()
  @MaxLength(MAX_PRODUCT_DESCRIPTION_LENGTH)
  public readonly description: string;

  @IsNumber()
  @Min(0)
  @Max(MAX_INT_32)
  public readonly price: number;

  constructor(raw: NoMethods<CreateSalesProduct>) {
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
  }
}
