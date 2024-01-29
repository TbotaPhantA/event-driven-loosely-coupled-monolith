import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { ProductOutputDto } from '../../dto/output/productOutputDto';

export interface IProductIdempotencyService {
  assertRequestIsIdempotent(transaction: ITransaction): Promise<void>;
  insertRequest(dto: ProductOutputDto, transaction: ITransaction): Promise<void>;
}
