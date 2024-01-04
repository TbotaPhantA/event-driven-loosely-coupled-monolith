import { Module, Provider } from '@nestjs/common';
import { SalesProductIdempotencyService } from './services/salesProductIdempotency.service';
import {
  DatabaseSalesProductIdempotentRequestRepository
} from './repositories/databaseSalesProductIdempotentRequestRepository';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from './constants';

const salesProductIdempotencyServiceProvider: Provider = {
  provide: SALES_PRODUCT_IDEMPOTENCY_SERVICE,
  useClass: SalesProductIdempotencyService,
}

@Module({
  providers: [salesProductIdempotencyServiceProvider, DatabaseSalesProductIdempotentRequestRepository],
  exports: [salesProductIdempotencyServiceProvider],
})
export class IdempotencyModule {}
