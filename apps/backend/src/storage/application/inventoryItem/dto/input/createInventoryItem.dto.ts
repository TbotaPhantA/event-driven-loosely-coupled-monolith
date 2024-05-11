import { IsNotEmpty, IsString } from 'class-validator';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class CreateInventoryItemDto {
  @IsNotEmpty()
  @IsString()
  inventoryItemId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  static fromRaw(raw: NoMethods<CreateInventoryItemDto>): CreateInventoryItemDto {
    const dto = new CreateInventoryItemDto();

    dto.inventoryItemId = raw.inventoryItemId;
    dto.name = raw.name;
    dto.description = raw.description;

    return dto;
  }
}
