import { Module } from '@nestjs/common';
import { TRANSACTION_SERVICE } from './shared/constants';
import { NoTransactionService } from './noTransactionService';

const transactionServiceProvider = {
  provide: TRANSACTION_SERVICE,
  useClass: NoTransactionService,
};

@Module({
  providers: [transactionServiceProvider],
  exports: [transactionServiceProvider],
})
export class TransactionModule {}
