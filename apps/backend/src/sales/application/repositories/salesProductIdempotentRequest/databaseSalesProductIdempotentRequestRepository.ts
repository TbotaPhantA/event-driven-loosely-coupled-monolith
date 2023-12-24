import { SalesProductRequestEntity } from '../../entities/salesProductRequest.entity';
import { ISalesProductIdempotentRequestRepository } from './ISalesProductIdempotentRequestRepository';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseSalesProductIdempotentRequestRepository implements ISalesProductIdempotentRequestRepository {
    async findRequestByCorrelationId(
      correlationId: string,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity | null> {
      return await transaction.findOne(SalesProductRequestEntity, {
        where: { correlationId },
        relations: ['salesProduct'],
      });
    }
    async insertRequest(
      request: SalesProductRequestEntity,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity> {
      return transaction.save(request);
    }
}
