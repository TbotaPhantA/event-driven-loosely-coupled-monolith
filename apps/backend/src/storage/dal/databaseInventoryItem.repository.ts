import { InventoryItemRepository } from './inventoryItem.repository';
import { InventoryItem } from '../domain/inventoryItem/inventoryItem';
import { EntityManager } from 'typeorm';
import { InventoryItemMapper } from './inventoryItem.mapper';

export class DatabaseInventoryItemRepository implements InventoryItemRepository {
  async insert(item: InventoryItem, manager: EntityManager): Promise<InventoryItem> {
    const entity = InventoryItemMapper.toEntity(item);
    const insertedEntity = await manager.save(entity);
    return InventoryItemMapper.toDomain(insertedEntity);
  }
}
