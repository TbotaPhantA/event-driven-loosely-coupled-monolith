import {
  SalesProductIdempMessageEntity,
} from '../../../../infrastructure/idempotency/entities/salesProductIdempMessageEntity';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';

export interface ISalesProductIdempMessagesService {
  assertMessageIsNotAlreadyProcessed(messageId: string, transaction: ITransaction): Promise<void>;
  insertMessage(messageId: string, transaction: ITransaction): Promise<SalesProductIdempMessageEntity>;
}
