import { InventoryItem } from '../domain/inventoryItem/inventoryItem';
import { InventoryItemEntity } from './inventoryItem.entity';

export class InventoryItemMapper {
  static toEntity(domain: InventoryItem): InventoryItemEntity {
    return InventoryItemEntity.createByRaw(domain.export());
  }

  static toDomain(entity: InventoryItemEntity): InventoryItem {
    return new InventoryItem(entity);
  }
}
