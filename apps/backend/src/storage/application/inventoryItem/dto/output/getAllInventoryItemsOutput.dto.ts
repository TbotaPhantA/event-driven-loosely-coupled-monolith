import { ApiProperty } from '@nestjs/swagger';
import { InventoryItem } from '../../../../domain/inventoryItem/inventoryItem';
import { InventoryItemOutputDto } from './inventoryItemOutput.dto';

export class GetAllInventoryItemsOutputDto {
  @ApiProperty({ type: [InventoryItemOutputDto] })
  items!: InventoryItemOutputDto[];

  @ApiProperty()
  total!: number;

  static from(items: InventoryItem[], total: number): GetAllInventoryItemsOutputDto {
    const dto = new GetAllInventoryItemsOutputDto();

    dto.items = items.map(i => new InventoryItemOutputDto(i.export()));
    dto.total = total;

    return dto;
  }
}
