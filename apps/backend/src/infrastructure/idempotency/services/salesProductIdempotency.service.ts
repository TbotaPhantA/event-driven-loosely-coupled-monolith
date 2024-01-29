import { Injectable } from '@nestjs/common';
import { CorrelationService } from '../../correlation';
import { ProductAlreadyCreatedException } from '../../../sales/application/exceptions/productAlreadyCreatedException';
import { SalesProductRequestEntity } from '../entities/salesProductRequest.entity';
import {
  IProductIdempotencyService
} from '../../../sales/application/services/interfaces/IProductIdempotency.service';
import {
  DatabaseSalesProductIdempotentRequestRepository
} from '../repositories/databaseSalesProductIdempotentRequestRepository';
import { EntityManager } from 'typeorm';
import { ProductOutputDto } from '../../../sales/application/dto/output/productOutputDto';

@Injectable()
export class SalesProductIdempotencyService implements IProductIdempotencyService {
  constructor(
    private readonly correlationService: CorrelationService,
    private readonly repo: DatabaseSalesProductIdempotentRequestRepository,
  ) {}

  async assertRequestIsIdempotent(transaction: EntityManager): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const existingRequest = await this.repo.findRequestByCorrelationId(correlationId, transaction);

    if (existingRequest) {
      throw new ProductAlreadyCreatedException(existingRequest.data);
    }
  }

  async insertRequest(dto: ProductOutputDto, transaction: EntityManager): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const request = SalesProductRequestEntity.from({
      data: dto,
      correlationId,
    });
    await this.repo.insertRequest(request, transaction);
  }
}
