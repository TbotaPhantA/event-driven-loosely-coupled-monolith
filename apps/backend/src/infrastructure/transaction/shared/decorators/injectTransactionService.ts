import { Inject } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../constants';

export const InjectTransactionService = (): ReturnType<typeof Inject> =>
  Inject(TRANSACTION_SERVICE);
