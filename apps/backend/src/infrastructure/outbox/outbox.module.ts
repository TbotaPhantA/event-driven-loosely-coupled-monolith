import { Module } from '@nestjs/common';
import { SalesProductMessageService } from './salesProductMessage.service';

@Module({
  providers: [SalesProductMessageService],
  exports: [SalesProductMessageService],
})
export class OutboxModule {}
