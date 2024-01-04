import { Module, Provider } from '@nestjs/common';
import { SalesProductMessagesService } from './services/salesProductMessages.service';
import { SALES_PRODUCT_MESSAGES_SERVICE } from './constants';
import { SalesProductMessageRepository } from './repositories/salesProductMessage.repository';

const salesProductServiceProvider: Provider = {
  provide: SALES_PRODUCT_MESSAGES_SERVICE,
  useClass: SalesProductMessagesService,
}

@Module({
  providers: [salesProductServiceProvider, SalesProductMessageRepository],
  exports: [salesProductServiceProvider],
})
export class MessagesModule {}
