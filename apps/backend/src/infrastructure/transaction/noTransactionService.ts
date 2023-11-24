import { ITransactionService } from './ITransaction.service';
import { IsolationLevel } from './isolationLevel.enum';
import { Injectable } from '@nestjs/common';
import { ITransaction } from './shared/types/ITransaction';

@Injectable()
export class NoTransactionService implements ITransactionService {
  withTransaction<T>(
    level: IsolationLevel,
    fn: (transaction: ITransaction) => T,
  ): T {
    return fn({});
  }
}
