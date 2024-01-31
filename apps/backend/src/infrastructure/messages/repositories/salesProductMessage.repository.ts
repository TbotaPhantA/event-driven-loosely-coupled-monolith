import { Injectable } from '@nestjs/common';
import { SalesProductMessage } from '../entities/salesProductMessage.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SalesProductMessageRepository {
  async insertMany(message: SalesProductMessage[], transaction: EntityManager): Promise<SalesProductMessage[]> {
    return transaction.save(message);
  };
}
