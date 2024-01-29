import { Product } from '../../../domain/product/product';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';

export interface IProductRepository {
  findOneById(productId: string, transaction: ITransaction): Promise<Product | null>;
  save(product: Product, transaction: ITransaction): Promise<Product>;
}
