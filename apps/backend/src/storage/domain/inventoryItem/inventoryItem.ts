import { CreateInventoryItemDto } from '../../application/inventoryItem/dto/input/createInventoryItem.dto';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Exportable } from '../../../infrastructure/shared/types/exportable';
import { Importable } from '../../../infrastructure/shared/types/importable';
import { DeepReadonly } from '../../../infrastructure/shared/types/deepReadonly';
import * as _ from 'lodash';

export class InventoryItem implements Exportable, Importable {
  private __data: InventoryItemData;

  constructor(data: InventoryItemData) {
    this.__data = data;
  }

  static create(dto: CreateInventoryItemDto, deps: Deps): InventoryItem {
    const now = deps.time.now();

    return new InventoryItem({
      inventoryItemId: dto.inventoryItemId,
      name: dto.name,
      description: dto.description,
      quantity: 0,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    })
  }

  import(data: InventoryItemData): void { this.__data = data; }
  export(): DeepReadonly<InventoryItemData> { return _.cloneDeep(this.__data); }
}

interface InventoryItemData {
  inventoryItemId: string;
  name: string;
  description: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}

interface Deps {
  time: TimeService;
}
