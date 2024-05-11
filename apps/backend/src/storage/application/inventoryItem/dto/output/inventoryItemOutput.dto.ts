import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class InventoryItemOutputDto {
  readonly inventoryItemId: string;
  readonly name: string;
  readonly description: string;
  readonly quantity: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly removedAt: Date | null;

  constructor(raw: NoMethods<InventoryItemOutputDto>) {
    this.inventoryItemId = raw.inventoryItemId;
    this.name = raw.name;
    this.description = raw.description;
    this.quantity = raw.quantity;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.removedAt = raw.removedAt;
  }
}
