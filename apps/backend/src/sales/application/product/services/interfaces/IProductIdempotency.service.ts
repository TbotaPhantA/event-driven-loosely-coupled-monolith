import { ITransaction } from '../../../../../infrastructure/transaction/shared/types/ITransaction';
import { CreateProductOutputDto } from '../../dto/output/createProductOutputDto';

export type IdempotentResponses = CreateProductOutputDto;

export interface IProductIdempotencyService {
  assertCreateProductRequestIsIdempotent(transaction: ITransaction): Promise<void>;
  insertRequest(dto: IdempotentResponses, transaction: ITransaction): Promise<void>;
}
