import { Module, Provider } from '@nestjs/common';
import { SalesProductIdempotencyService } from './services/salesProductIdempotency.service';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE, SALES_PRODUCT_IDEMP_MESSAGES_SERVICE } from './constants';
import { SalesProductIdempMessagesService } from './services/salesProductIdempMessages.service';

const salesProductIdempotencyServiceProvider: Provider = {
  provide: SALES_PRODUCT_IDEMPOTENCY_SERVICE,
  useClass: SalesProductIdempotencyService,
}

const salesProductMessageIdempServiceProvider: Provider = {
  provide: SALES_PRODUCT_IDEMP_MESSAGES_SERVICE,
  useClass: SalesProductIdempMessagesService,
}

@Module({
  providers: [salesProductIdempotencyServiceProvider, salesProductMessageIdempServiceProvider],
  exports: [salesProductIdempotencyServiceProvider, salesProductMessageIdempServiceProvider],
})
export class IdempotencyModule {}
