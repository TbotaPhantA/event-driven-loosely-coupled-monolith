import { Module } from '@nestjs/common';
import { TimeService } from './time.service';

@Module({
  providers: [TimeService],
  exports: [TimeService]
})
export class TimeModule {}
