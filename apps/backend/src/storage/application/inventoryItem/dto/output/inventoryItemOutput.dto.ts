import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';
import { ApiProperty } from '@nestjs/swagger';

export class InventoryItemOutputDto {
  @ApiProperty()
  readonly inventoryItemId: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly quantity: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ example: null })
  readonly removedAt: Date | null;

  constructor(raw: NoMethods<InventoryItemOutputDto>) {
    this.inventoryItemId = raw.inventoryItemId;
    this.name = raw.name;
    this.description = raw.description;
    this.quantity = raw.quantity;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.removedAt = raw.removedAt;
  }
}
