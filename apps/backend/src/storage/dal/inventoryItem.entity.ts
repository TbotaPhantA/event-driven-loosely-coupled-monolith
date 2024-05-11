import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NoMethods } from '../../infrastructure/shared/types/noMethods';

@Entity({ name: InventoryItemEntity.TABLE_NAME })
export class InventoryItemEntity {
  static TABLE_NAME = 'storage_inventory_item';

  @PrimaryColumn({ name: 'inventory_item_id' })
  inventoryItemId!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  quantity!: number;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @Column({ name: 'removed_at', type: 'timestamp with time zone', nullable: true })
  removedAt!: Date | null;

  static createByRaw(raw: NoMethods<InventoryItemEntity>): InventoryItemEntity {
    const entity = new InventoryItemEntity();

    entity.inventoryItemId = raw.inventoryItemId;
    entity.name = raw.name;
    entity.description = raw.description;
    entity.quantity = raw.quantity;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.removedAt = raw.removedAt;

    return entity;
  }
}
