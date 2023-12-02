import { IsolationLevelUnion } from './isolationLevelUnion';
import { ITransaction } from './shared/types/ITransaction';

export interface ITransactionService {
  withTransaction<T>(level: IsolationLevelUnion, fn: (transaction: ITransaction) => Promise<T>): Promise<T>;
}
