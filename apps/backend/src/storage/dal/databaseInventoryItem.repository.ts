import { GetManyParams, InventoryItemRepository } from './inventoryItem.repository';
import { InventoryItem } from '../domain/inventoryItem/inventoryItem';
import { EntityManager, Repository } from 'typeorm';
import { InventoryItemMapper } from './inventoryItem.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItemEntity } from './inventoryItem.entity';

export class DatabaseInventoryItemRepository implements InventoryItemRepository {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private readonly dbRepo: Repository<InventoryItemEntity>,
  ) {}

  async getMany(params: GetManyParams): Promise<{ items: InventoryItem[]; total: number }> {
    const [items, total] = await this.dbRepo.findAndCount({
      take: params.limit,
      skip: params.offset,
    })

    return { items: items.map(i => InventoryItemMapper.toDomain(i)), total };
  }

  async insert(item: InventoryItem, manager: EntityManager): Promise<InventoryItem> {
    const entity = InventoryItemMapper.toEntity(item);
    const insertedEntity = await manager.save(entity);
    return InventoryItemMapper.toDomain(insertedEntity);
  }
}
