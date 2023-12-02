import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';

export interface ISalesProductRepository {
  findOneById(
    productId: string,
    transaction: ITransaction,
  ): Promise<SalesProduct | null>;
  save(product: SalesProduct, transaction: ITransaction): Promise<SalesProduct>;
}
