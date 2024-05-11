import { IsDate, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesProductEventPayloadChanges {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: 500;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Type(() => Date)
  @IsDate()
  removedAt!: Date | null;
}
