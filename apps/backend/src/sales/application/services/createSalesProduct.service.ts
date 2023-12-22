import { Injectable } from '@nestjs/common';
import { CreateSalesProductOutputDto } from '../dto/output/createSalesProductOutput.dto';
import { CreateSalesProduct } from '../../domain/salesProduct/commands/createSalesProduct';
import {
  InjectTransactionService
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductFactory } from '../../domain/salesProduct/salesProduct.factory';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';

@Injectable()
export class CreateSalesProductService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
    private readonly repo: ISalesProductRepository,
    private readonly factory: SalesProductFactory,
  ) {}

  async runTransaction(command: CreateSalesProduct): Promise<CreateSalesProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.create(command, transaction));
  }

  async create(command: CreateSalesProduct, transaction: ITransaction): Promise<CreateSalesProductOutputDto> {
    const product = this.factory.create(command);
    const savedProduct = await this.repo.save(product, transaction);
    // TODO: save event
    return CreateSalesProductOutputDto.from(savedProduct);
  }
}
