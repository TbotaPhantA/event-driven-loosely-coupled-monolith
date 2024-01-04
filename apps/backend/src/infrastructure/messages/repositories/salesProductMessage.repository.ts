import { Injectable } from '@nestjs/common';
import { SalesProductMessage } from '../entities/salesProduct.message';
import { EntityManager } from 'typeorm';

@Injectable()
export class SalesProductMessageRepository {
  async insert(message: SalesProductMessage, transaction: EntityManager): Promise<SalesProductMessage> {
    return transaction.save(message);
  };
}
