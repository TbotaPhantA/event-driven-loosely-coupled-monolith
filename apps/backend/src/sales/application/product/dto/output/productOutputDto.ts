import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class ProductOutputDto {
  @ApiProperty({ example: '01HG1MMNZRYYPFBKZDNQ4P08HB' })
  readonly productId: string;

  @ApiProperty({ example: 'Phone' })
  readonly name: string;

  @ApiProperty({ example: 'An android phone' })
  readonly description: string;

  @ApiProperty({ example: 500 })
  readonly price: number;

  @ApiProperty({ example: new Date(2022, 0, 3).toISOString() })
  readonly createdAt: Date;

  @ApiProperty({ example: new Date(2022, 0, 3).toISOString() })
  readonly updatedAt: Date;

  @ApiProperty({ example: null })
  readonly removedAt: Date | null;

  constructor(raw: NoMethods<ProductOutputDto>) {
    this.productId = raw.productId;
    this.name = raw.name;
    this.description = raw.description;
    this.price = raw.price;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.removedAt = raw.removedAt;
  }
}
