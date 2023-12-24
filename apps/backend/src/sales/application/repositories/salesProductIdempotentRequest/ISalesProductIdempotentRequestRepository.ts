import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductRequestEntity } from '../../entities/salesProductRequest.entity';

export interface ISalesProductIdempotentRequestRepository {
  findRequestByCorrelationId(
    correlationId: string,
    transaction: ITransaction,
  ): Promise<SalesProductRequestEntity | null>;
  insertRequest(request: SalesProductRequestEntity, transaction: ITransaction): Promise<SalesProductRequestEntity>
}
