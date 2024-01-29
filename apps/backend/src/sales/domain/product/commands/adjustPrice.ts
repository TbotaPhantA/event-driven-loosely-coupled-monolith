import { IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { MAX_INT_32, ULID_LENGTH } from '../../../../infrastructure/shared/constants';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class AdjustPrice {
  @IsString()
  @Length(ULID_LENGTH)
  @ApiProperty({ example: '01HGNJHGSPJS3QM3ZGMY181ZX4' })
  productId!: string;

  @IsNumber()
  @Min(0)
  @Max(MAX_INT_32)
  @ApiProperty({ example: 100 })
  newPrice!: number;

  static createByRaw(raw: NoMethods<AdjustPrice>): AdjustPrice {
    const command = new AdjustPrice();
    command.productId = raw.productId;
    command.newPrice = raw.newPrice;
    return command;
  }
}
