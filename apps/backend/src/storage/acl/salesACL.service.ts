import { Injectable } from '@nestjs/common';
import {
  CreateSalesProductEventPayload
} from './dto/input/createSalesProductEventPayload.dto';
import { CreateInventoryItemDto } from '../application/inventoryItem/dto/input/createInventoryItem.dto';

@Injectable()
export class SalesACLService {
  async mapCreateSalesProductPayloadToCreateInventoryItem(
    event: CreateSalesProductEventPayload,
  ): Promise<CreateInventoryItemDto> {
    return CreateInventoryItemDto.fromRaw({
      inventoryItemId: event.changes.productId,
      name: event.changes.name,
      description: event.changes.description,
    });
  }
}
