import {
  IProductMessagesService,
} from '../../../sales/application/product/services/interfaces/IProductMessages.service';
import { Injectable } from '@nestjs/common';
import { SalesProductMessageRepository } from '../repositories/salesProductMessage.repository';
import { SalesProductMessage } from '../entities/salesProductMessage.entity';
import { PLACEHOLDER_ID } from '../../shared/constants';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { CorrelationService } from '../../correlation';
import { EntityManager } from 'typeorm';
import { IProductEvent } from '../../../sales/domain/product/events/IProductEvent';

@Injectable()
export class SalesProductMessagesService implements IProductMessagesService {
  constructor(
    private readonly salesProductMessageRepository: SalesProductMessageRepository,
    private readonly correlationService: CorrelationService,
  ) {}

  async insertEvents(
    events: IProductEvent[],
    transaction: EntityManager,
  ): Promise<void> {
    const messages = events.map(event => SalesProductMessage.createByRaw({
      messageId: PLACEHOLDER_ID,
      messageName: event.eventName,
      messageType: MessageTypeEnum.event,
      correlationId: this.correlationService.getCorrelationId(),
      aggregateId: event.aggregateId,
      aggregateName: event.aggregateName,
      contextName: event.contextName,
      data: event.data,
    }))

    await this.salesProductMessageRepository.insertMany(messages, transaction);
  }
}
