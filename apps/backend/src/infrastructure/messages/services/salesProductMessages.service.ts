import {
  ISalesProductMessagesService
} from '../../../sales/application/services/interfaces/ISalesProductMessagesService';
import { Injectable } from '@nestjs/common';
import { SalesProductMessageRepository } from '../repositories/salesProductMessage.repository';
import { SalesProductMessage } from '../entities/salesProductMessage.entity';
import { PLACEHOLDER_ID } from '../../shared/constants';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { CorrelationService } from '../../correlation';
import { EntityManager } from 'typeorm';
import { SalesProductOutputDto } from '../../../sales/application/dto/output/salesProductOutputDto';
import { IEvent } from '../../../sales/domain/salesProduct/events/IEvent';
import { SalesProductCreatedData } from '../../../sales/domain/salesProduct/events/salesProductCreated';

@Injectable()
export class SalesProductMessagesService implements ISalesProductMessagesService {
  constructor(
    private readonly salesProductMessageRepository: SalesProductMessageRepository,
    private readonly correlationService: CorrelationService,
  ) {}

  async insertEvent(
    event: IEvent<SalesProductCreatedData>,
    producerName: string,
    transaction: EntityManager,
  ): Promise<void> {
    const message = SalesProductMessage.createByRaw({
      messageId: PLACEHOLDER_ID,
      messageName: event.eventName,
      messageType: MessageTypeEnum.event,
      correlationId: this.correlationService.getCorrelationId(),
      producerName,
      aggregateId: event.data.product.productId,
      data: event.data,
    });

    await this.salesProductMessageRepository.insert(message, transaction);
  }
}
