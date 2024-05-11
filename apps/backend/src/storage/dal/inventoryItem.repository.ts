import { InventoryItem } from '../domain/inventoryItem/inventoryItem';
import { ITransaction } from '../../infrastructure/transaction/shared/types/ITransaction';

export interface GetManyParams {
  limit: number;
  offset: number;
}

export interface InventoryItemRepository {
  getMany(params: GetManyParams): Promise<{ items: InventoryItem[], total: number }>;
  insert(item: InventoryItem, transaction: ITransaction): Promise<InventoryItem>;
}
