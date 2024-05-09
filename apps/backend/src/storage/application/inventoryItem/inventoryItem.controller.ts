import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from '../../../infrastructure/shared/decorators/validate';
import { HttpExceptionFilter } from '../../../infrastructure/shared/exceptionFilters/httpException.filter';
import { storageInventoryItemResource } from '../shared/resources';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import { config } from '../../../infrastructure/config/config';
import { validatePayload } from '../../../infrastructure/shared/utils/validatePayload';
import { CreateSalesProductEventPayload } from './dto/input/createSalesProductEventPayload.dto';
import { MessageNames } from '../shared/enums/messageNames.enum';
import { getMessageByContext } from '../../../infrastructure/shared/utils/getMessageByContext';

@Controller(storageInventoryItemResource)
@ApiTags(storageInventoryItemResource)
@Validate()
@UseFilters(HttpExceptionFilter)
export class InventoryItemController {
  async getAllInventoryItems(): Promise<void> { }

  @EventPattern(config.kafka.kafkaProductsTopic)
  async handleSalesProductEvent(@Ctx() context: KafkaContext): Promise<void> {
    const message = getMessageByContext(context);
    const plainPayload = JSON.parse(message.value.payload);

    if (message.headers.messageName === MessageNames.ProductCreated) {
      const payload = await validatePayload(CreateSalesProductEventPayload, plainPayload);
      // TODO: create inventory item via ACL
      console.log({ payload });
    }
  }
}
