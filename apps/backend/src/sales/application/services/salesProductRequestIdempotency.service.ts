import { CorrelationService } from '../../../infrastructure/correlation';
import { Injectable } from '@nestjs/common';
import {
  ISalesProductIdempotentRequestRepository
} from '../repositories/salesProductIdempotentRequest/ISalesProductIdempotentRequestRepository';
import { ProductAlreadyCreatedException } from '../exceptions/productAlreadyCreatedException';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { SalesProductRequestEntity } from '../entities/salesProductRequest.entity';
import {
  InjectSalesProductIdempotentRequestRepository
} from '../shared/decorators/injectSalesProductIdempotentRequestRepository';

@Injectable()
export class SalesProductRequestIdempotencyService {
  constructor(
    private readonly correlationService: CorrelationService,
    @InjectSalesProductIdempotentRequestRepository()
    private readonly repo: ISalesProductIdempotentRequestRepository,
  ) {}

  async assertCreateSalesProductIdempotent(transaction: ITransaction): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const existingRequest = await this.repo.findRequestByCorrelationId(correlationId, transaction);

    if (existingRequest) {
      throw new ProductAlreadyCreatedException(existingRequest.salesProduct);
    }
  }

  async insert(salesProduct: SalesProduct, transaction: ITransaction): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const request = SalesProductRequestEntity.from({ salesProduct, correlationId });
    await this.repo.insertRequest(request, transaction);
  }
}
