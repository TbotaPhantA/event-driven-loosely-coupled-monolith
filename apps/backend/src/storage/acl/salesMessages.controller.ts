import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import { config } from '../../infrastructure/config/config';
import { getMessageByContext } from '../../infrastructure/shared/utils/getMessageByContext';
import { MessageNamesEnum } from '../application/shared/enums/messageNames.enum';
import { validatePayload } from '../../infrastructure/shared/utils/validatePayload';
import {
  CreateSalesProductEventPayload
} from './dto/input/createSalesProductEventPayload.dto';
import { SalesACLService } from './salesACL.service';
import { InventoryItemCreateService } from '../application/inventoryItem/services/inventoryItemCreate.service';

@Controller()
export class SalesMessagesController {
  constructor(
    private readonly salesACLService: SalesACLService,
    private readonly inventoryItemCreateService: InventoryItemCreateService,
  ) {}

  @EventPattern(config.kafka.kafkaProductsTopic)
  async handleSalesProductEvent(@Ctx() context: KafkaContext): Promise<void> {
    const message = getMessageByContext(context);
    const plainPayload = JSON.parse(message.value.payload);

    if (message.headers.messageName === MessageNamesEnum.ProductCreated) {
      const event = await validatePayload(CreateSalesProductEventPayload, plainPayload);
      const dto = await this.salesACLService.mapCreateSalesProductPayloadToCreateInventoryItem(event);
      await this.inventoryItemCreateService.runTransaction(dto);
    }
  }
}
