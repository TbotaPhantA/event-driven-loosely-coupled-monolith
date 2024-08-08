import { Injectable } from '@nestjs/common';
import { CorrelationService } from '../../correlation';
import {
  ProductAlreadyCreatedException,
} from '../../../sales/application/product/exceptions/productAlreadyCreatedException';
import { SalesProductRequestEntity } from '../entities/salesProductRequest.entity';
import {
  IProductIdempotencyService,
  IdempotentResponses,
} from '../../../sales/application/product/services/interfaces/IProductIdempotency.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class SalesProductIdempotencyService implements IProductIdempotencyService {
  constructor(
    private readonly correlationService: CorrelationService,
  ) {}

  async assertCreateProductRequestIsIdempotent(transaction: EntityManager): Promise<void> {
    const existingRequest = await transaction.findOne(SalesProductRequestEntity, {
      where: { correlationId: this.correlationService.getCorrelationId() },
    });

    if (existingRequest) {
      throw new ProductAlreadyCreatedException(existingRequest.response);
    }
  }

  async insertRequest(response: IdempotentResponses, transaction: EntityManager): Promise<void> {
    const correlationId = this.correlationService.getCorrelationId();
    const request = SalesProductRequestEntity.from({
      response,
      correlationId,
      productId: response.product.productId,
    });

    await transaction.save(request);
  }
}
