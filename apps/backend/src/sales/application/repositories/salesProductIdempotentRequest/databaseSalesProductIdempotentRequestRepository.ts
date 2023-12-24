import { SalesProductRequestEntity } from '../../entities/salesProductRequest.entity';
import { ISalesProductIdempotentRequestRepository } from './ISalesProductIdempotentRequestRepository';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseSalesProductIdempotentRequestRepository implements ISalesProductIdempotentRequestRepository {
    findRequestByCorrelationId(
      correlationId: string,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity | null> {
      return transaction.findOne(SalesProductRequestEntity, {
        where: { correlationId },
        relations: ['salesProduct'],
      });
    }
    insertRequest(
      request: SalesProductRequestEntity,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity> {
      return transaction.save(request);
    }
}
