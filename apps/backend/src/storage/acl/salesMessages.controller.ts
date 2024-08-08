import { Controller, Inject } from '@nestjs/common';
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
import { TRANSACTION_SERVICE } from '../../infrastructure/transaction/shared/constants';
import { ITransactionService } from '../../infrastructure/transaction/ITransaction.service';
import { CreateInventoryItemOutputDto } from '../application/inventoryItem/dto/output/createInventoryItemOutput.dto';
import { ITransaction } from '../../infrastructure/transaction/shared/types/ITransaction';
import { Message } from '../../infrastructure/shared/utils/extractMessage';
import {
  ISalesProductIdempMessagesService,
} from '../application/services/interfaces/ISalesProductIdempMessagesService';
import { SALES_PRODUCT_IDEMP_MESSAGES_SERVICE } from '../../infrastructure/idempotency/constants';

@Controller()
export class SalesMessagesController {
  constructor(
    private readonly salesACLService: SalesACLService,
    private readonly inventoryItemCreateService: InventoryItemCreateService,
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_IDEMP_MESSAGES_SERVICE)
    private readonly idempService: ISalesProductIdempMessagesService,
  ) {}

  // TODO: handle errors
  @EventPattern(config.kafka.kafkaProductsTopic)
  async handleSalesProductEvent(@Ctx() context: KafkaContext): Promise<void> {
    const message = getMessageByContext(context);
    const plainPayload = JSON.parse(message.value.payload);
    const { messageId } = message.headers;

    await this.transactionService.withTransaction('READ COMMITTED', async transaction => {
      await this.idempService.assertMessageIsNotAlreadyProcessed(messageId, transaction);
      await this.idempService.insertMessage(messageId, transaction);
      await this.handle(message, plainPayload, transaction);
    });
  }

  private async handle(message: Message, plainPayload: any, transaction: ITransaction): Promise<void> {
    if (message.headers.messageName === MessageNamesEnum.ProductCreated) {
      await this.handleProductCreated(plainPayload, transaction);
    }
  }

  private async handleProductCreated(plain: any, transaction: ITransaction): Promise<CreateInventoryItemOutputDto> {
    const event = await validatePayload(CreateSalesProductEventPayload, plain);
    const dto = await this.salesACLService.mapCreateSalesProductPayloadToCreateInventoryItem(event);
    return this.inventoryItemCreateService.create(dto, transaction);
  }
}
