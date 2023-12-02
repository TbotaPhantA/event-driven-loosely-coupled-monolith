import { ITransactionService } from './ITransaction.service';
import { IsolationLevelUnion } from './isolationLevelUnion';
import { ITransaction } from './shared/types/ITransaction';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseTransactionService implements ITransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async withTransaction<T>(level: IsolationLevelUnion, fn: (transaction: ITransaction) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(level, (entityManager): Promise<T> => {
      return fn(entityManager);
    });
  }
}
