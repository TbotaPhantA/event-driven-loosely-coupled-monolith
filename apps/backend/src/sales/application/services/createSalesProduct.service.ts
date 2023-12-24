import { Injectable } from '@nestjs/common';
import { CreateSalesProductOutputDto } from '../dto/output/createSalesProductOutput.dto';
import { CreateSalesProduct } from '../../domain/salesProduct/commands/createSalesProduct';
import {
  InjectTransactionService
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductFactory } from '../../domain/salesProduct/salesProduct.factory';
import { ISalesProductRepository } from '../repositories/salesProductRepository/ISalesProduct.repository';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { SalesProductRequestIdempotencyService } from './salesProductRequestIdempotency.service';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';

@Injectable()
export class CreateSalesProductService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
    private readonly repo: ISalesProductRepository,
    private readonly factory: SalesProductFactory,
    private readonly idempotentRequestService: SalesProductRequestIdempotencyService,
  ) {}

  async runTransaction(command: CreateSalesProduct): Promise<CreateSalesProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.create(command, transaction));
  }

  async create(command: CreateSalesProduct, transaction: ITransaction): Promise<CreateSalesProductOutputDto> {
    await this.idempotentRequestService.assertCreateSalesProductIdempotent(transaction);
    const product = this.factory.create(command);
    const [savedProduct] = await this.saveChanges(product, transaction);
    return CreateSalesProductOutputDto.from(savedProduct);
  }

  private saveChanges(product: SalesProduct, transaction: ITransaction): Promise<[SalesProduct, ...unknown[]]> {
    return Promise.all([
      this.repo.save(product, transaction),
      this.idempotentRequestService.insert(product, transaction)
      // TODO: save event
    ]);
  }
}
