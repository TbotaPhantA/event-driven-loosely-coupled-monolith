import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SalesProductRequestEntity } from '../entities/salesProductRequest.entity';

@Injectable()
export class DatabaseSalesProductIdempotentRequestRepository {
    findRequestByCorrelationId(
      correlationId: string,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity | null> {
      return transaction.findOne(SalesProductRequestEntity, { where: { correlationId } });
    }
    insertRequest(
      request: SalesProductRequestEntity,
      transaction: EntityManager,
    ): Promise<SalesProductRequestEntity> {
      return transaction.save(request);
    }
}
