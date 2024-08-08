import { Injectable } from '@nestjs/common';
import { SalesProductIdempMessageEntity } from '../entities/salesProductIdempMessageEntity';
import { EntityManager } from 'typeorm';
import {
  MessageIsAlreadyProcessedException
} from '../../../storage/application/shared/errors/messageIsAlreadyProcessedException';
import {
  ISalesProductIdempMessagesService,
} from '../../../storage/application/services/interfaces/ISalesProductIdempMessagesService';

@Injectable()
export class SalesProductIdempMessagesService implements ISalesProductIdempMessagesService {
  async assertMessageIsNotAlreadyProcessed(messageId: string, transaction: EntityManager): Promise<void> {
    const existingMessage = await transaction.findOne(SalesProductIdempMessageEntity, {
      where: { messageId },
    })

    if (existingMessage) {
      throw new MessageIsAlreadyProcessedException();
    }
  }

  async insertMessage(messageId: string, transaction: EntityManager): Promise<SalesProductIdempMessageEntity> {
    const message = SalesProductIdempMessageEntity.createByRaw({ messageId });
    return transaction.save(message);
  }
}
