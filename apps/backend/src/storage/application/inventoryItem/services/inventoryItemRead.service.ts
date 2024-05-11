import { GetAllInventoryItemsDto } from '../dto/input/getAllInventoryItems.dto';
import { GetAllInventoryItemsOutputDto } from '../dto/output/getAllInventoryItemsOutput.dto';
import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_ITEM_REPOSITORY } from '../../shared/constants';
import { InventoryItemRepository } from '../../../dal/inventoryItem.repository';

@Injectable()
export class InventoryItemReadService {
  constructor(
    @Inject(INVENTORY_ITEM_REPOSITORY)
    private readonly repo: InventoryItemRepository,
  ) {}

  async getAllInventoryItems(queryParams: GetAllInventoryItemsDto): Promise<GetAllInventoryItemsOutputDto> {
    const { items, total } = await this.repo.getMany(queryParams);
    return GetAllInventoryItemsOutputDto.from(items, total);
  }
}
