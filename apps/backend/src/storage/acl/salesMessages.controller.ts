import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import { config } from '../../infrastructure/config/config';
import { getMessageByContext } from '../../infrastructure/shared/utils/getMessageByContext';
import { MessageNames } from '../application/shared/enums/messageNames.enum';
import { validatePayload } from '../../infrastructure/shared/utils/validatePayload';
import {
  CreateSalesProductEventPayload
} from '../application/inventoryItem/dto/input/createSalesProductEventPayload.dto';

@Controller()
export class SalesMessagesController {
  @EventPattern(config.kafka.kafkaProductsTopic)
  async handleSalesProductEvent(@Ctx() context: KafkaContext): Promise<void> {
    const message = getMessageByContext(context);
    const plainPayload = JSON.parse(message.value.payload);

    if (message.headers.messageName === MessageNames.ProductCreated) {
      const payload = await validatePayload(CreateSalesProductEventPayload, plainPayload);
      // const dto = this.salesACL.
      // TODO: create inventory item via ACL
      console.log({ payload });
    }
  }
}
