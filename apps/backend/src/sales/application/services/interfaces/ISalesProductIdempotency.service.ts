import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';

export interface ISalesProductIdempotencyService {
  assertCreateSalesProductIdempotent(transaction: ITransaction): Promise<void>;
  insert(salesProduct: SalesProduct, transaction: ITransaction): Promise<void>;
}
