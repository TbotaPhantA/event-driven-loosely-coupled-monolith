import { Module } from '@nestjs/common';
import { TRANSACTION_SERVICE } from './shared/constants';
import { DatabaseTransactionService } from './databaseTransaction.service';

const transactionServiceProvider = {
  provide: TRANSACTION_SERVICE,
  useClass: DatabaseTransactionService,
};

@Module({
  providers: [transactionServiceProvider],
  exports: [transactionServiceProvider],
})
export class TransactionModule {}
