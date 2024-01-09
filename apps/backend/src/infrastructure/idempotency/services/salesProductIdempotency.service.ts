import { Injectable } from '@nestjs/common';
import { CorrelationService } from '../../correlation';
import { ProductAlreadyCreatedException } from '../../../sales/application/exceptions/productAlreadyCreatedException';
import { SalesProduct } from '../../../sales/domain/salesProduct/salesProduct';
import { SalesProductRequestEntity } from '../entities/salesProductRequest.entity';
import {
  ISalesProductIdempotencyService
} from '../../../sales/application/services/interfaces/ISalesProductIdempotency.service';
import {
  DatabaseSalesProductIdempotentRequestRepository
} from '../repositories/databaseSalesProductIdempotentRequestRepository';
import { EntityManager } from 'typeorm';
import { SalesProductOutputDto } from '../../../sales/application/dto/output/salesProductOutputDto';

@Injectable()
export class SalesProductIdempotencyService implements ISalesProductIdempotencyService {
  constructor(
    private readonly correlationService: CorrelationService,
    private readonly repo: DatabaseSalesProductIdempotentRequestRepository,
  ) {}

  async assertCreateSalesProductIdempotent(transaction: EntityManager): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const existingRequest = await this.repo.findRequestByCorrelationId(correlationId, transaction);

    if (existingRequest) {
      throw new ProductAlreadyCreatedException(existingRequest.salesProduct);
    }
  }

  async insert(salesProduct: SalesProduct, transaction: EntityManager): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const request = SalesProductRequestEntity.from({
      salesProduct: new SalesProductOutputDto(salesProduct),
      correlationId,
    });
    await this.repo.insertRequest(request, transaction);
  }
}
