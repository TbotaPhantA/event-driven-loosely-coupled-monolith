import { InventoryItemOutputDto } from './inventoryItemOutput.dto';
import { InventoryItem } from '../../../../domain/inventoryItem/inventoryItem';

export class CreateInventoryItemOutputDto {
  inventoryItem!: InventoryItemOutputDto;

  static from(inventoryItem: InventoryItem): CreateInventoryItemOutputDto {
    const dto = new CreateInventoryItemOutputDto();

    dto.inventoryItem = new InventoryItemOutputDto(inventoryItem.export());

    return dto;
  }
}
