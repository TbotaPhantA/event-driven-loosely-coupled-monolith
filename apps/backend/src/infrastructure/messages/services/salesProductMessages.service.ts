import {
  ISalesProductMessagesService
} from '../../../sales/application/services/interfaces/ISalesProductMessagesService';
import { IEvent } from '../../../sales/domain/salesProduct/events/IEvent';
import { Injectable } from '@nestjs/common';
import { SalesProductMessageRepository } from '../repositories/salesProductMessage.repository';
import { SalesProductMessage } from '../entities/salesProductMessage.entity';
import { PLACEHOLDER_ID } from '../../shared/constants';
import { MessageTypeEnum } from '../../shared/enums/messageType.enum';
import { CorrelationService } from '../../correlation';
import { EntityManager } from 'typeorm';

@Injectable()
export class SalesProductMessagesService implements ISalesProductMessagesService {
  constructor(
    private readonly salesProductMessageRepository: SalesProductMessageRepository,
    private readonly correlationService: CorrelationService,
  ) {}

  async insertEvent(event: IEvent, producerName: string, transaction: EntityManager): Promise<void> {
    const message = SalesProductMessage.createByRaw({
      messageId: PLACEHOLDER_ID,
      messageName: event.eventName,
      messageType: MessageTypeEnum.event,
      correlationId: this.correlationService.getCorrelationId(),
      producerName,
      data: JSON.stringify(event.data),
    })

    await this.salesProductMessageRepository.insert(message, transaction);
  }
}
