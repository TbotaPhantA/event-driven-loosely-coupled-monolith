import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductOutputDto } from '../../dto/output/salesProductOutputDto';

export interface ISalesProductIdempotencyService {
  assertCreateSalesProductIdempotent(transaction: ITransaction): Promise<void>;
  insertRequest(dto: SalesProductOutputDto, transaction: ITransaction): Promise<void>;
}
