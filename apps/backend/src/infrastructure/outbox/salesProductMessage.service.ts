import { SalesProductMessage } from './messages/salesProductMessage';
import { IEvent } from '../shared/types/IEvent';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesProductMessageService {
  async save(events: IEvent[], transaction: EntityManager): Promise<SalesProductMessage[]> {
    const messages = events.map(event => {
      const message = new SalesProductMessage()

      message.name = event.name;
      message.aggregateId = event.aggregateId;
      message.data = event.data;

      return message;
    });


    return transaction.save(messages);
  }
}
