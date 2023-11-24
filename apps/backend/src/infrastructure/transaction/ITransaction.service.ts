import { IsolationLevel } from './isolationLevel.enum';
import { ITransaction } from './shared/types/ITransaction';

export interface ITransactionService {
  withTransaction<T>(
    level: IsolationLevel,
    fn: (transaction: ITransaction) => T,
  ): T;
}
