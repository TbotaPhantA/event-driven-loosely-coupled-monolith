import {
  IProductMessagesService,
} from '../../../sales/application/services/interfaces/IProductMessages.service';
import { Injectable } from '@nestjs/common';
import { SalesProductMessageRepository } from '../repositories/salesProductMessage.repository';
import { SalesProductMessage } from '../entities/salesProductMessage.entity';
import { PLACEHOLDER_ID } from '../../shared/constants';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { CorrelationService } from '../../correlation';
import { EntityManager } from 'typeorm';
import { IEvent } from '../../../sales/domain/product/events/IEvent';

@Injectable()
export class SalesProductMessagesService implements IProductMessagesService {
  constructor(
    private readonly salesProductMessageRepository: SalesProductMessageRepository,
    private readonly correlationService: CorrelationService,
  ) {}

  async insertEvent(
    event: IEvent,
    transaction: EntityManager,
  ): Promise<void> {
    const message = SalesProductMessage.createByRaw({
      messageId: PLACEHOLDER_ID,
      messageName: event.eventName,
      messageType: MessageTypeEnum.event,
      correlationId: this.correlationService.getCorrelationId(),
      aggregateId: event.aggregateId,
      aggregateName: event.aggregateName,
      contextName: event.contextName,
      data: event.data,
    });

    await this.salesProductMessageRepository.insert(message, transaction);
  }
}
