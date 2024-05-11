import { InventoryItem } from '../domain/inventoryItem/inventoryItem';
import { ITransaction } from '../../infrastructure/transaction/shared/types/ITransaction';

export interface InventoryItemRepository {
  insert(item: InventoryItem, transaction: ITransaction): Promise<InventoryItem>;
}
