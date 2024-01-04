import { Inject, Injectable } from '@nestjs/common';
import { CreateSalesProductOutputDto } from '../dto/output/createSalesProductOutput.dto';
import { CreateSalesProduct } from '../../domain/salesProduct/commands/createSalesProduct';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProductFactory } from '../../domain/salesProduct/salesProduct.factory';
import { ISalesProductRepository } from '../repositories/salesProductRepository/ISalesProduct.repository';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { ISalesProductMessagesService } from './interfaces/ISalesProductMessagesService';
import { TRANSACTION_SERVICE } from '../../../infrastructure/transaction/shared/constants';
import { SALES_CONTEXT_NAME, SALES_PRODUCT_REPOSITORY } from '../shared/constants';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from '../../../infrastructure/idempotency/constants';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../infrastructure/messages/constants';
import { SalesProductCreated } from '../../domain/salesProduct/events/salesProductCreated';
import { ISalesProductIdempotencyService } from './interfaces/ISalesProductIdempotency.service';

@Injectable()
export class CreateSalesProductService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: ISalesProductRepository,
    @Inject(SALES_PRODUCT_IDEMPOTENCY_SERVICE)
    private readonly idempotencyService: ISalesProductIdempotencyService,
    @Inject(SALES_PRODUCT_MESSAGES_SERVICE)
    private readonly messagesService: ISalesProductMessagesService,
    private readonly factory: SalesProductFactory,
  ) {}

  async runTransaction(command: CreateSalesProduct): Promise<CreateSalesProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.create(command, transaction));
  }

  async create(command: CreateSalesProduct, transaction: ITransaction): Promise<CreateSalesProductOutputDto> {
    await this.idempotencyService.assertCreateSalesProductIdempotent(transaction);
    const product = this.factory.create(command);
    const [savedProduct] = await this.saveChanges(product, transaction);
    return CreateSalesProductOutputDto.from(savedProduct);
  }

  private saveChanges(product: SalesProduct, transaction: ITransaction): Promise<[SalesProduct, ...unknown[]]> {
    const event = new SalesProductCreated(product);
    return Promise.all([
      this.repo.save(product, transaction),
      this.idempotencyService.insert(product, transaction),
      this.messagesService.insertEvent(event, SALES_CONTEXT_NAME, transaction),
    ]);
  }
}
