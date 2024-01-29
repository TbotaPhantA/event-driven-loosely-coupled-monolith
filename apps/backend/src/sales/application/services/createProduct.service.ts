import { Inject, Injectable } from '@nestjs/common';
import { CreateProductOutputDto } from '../dto/output/createProductOutputDto';
import { CreateProduct } from '../../domain/product/commands/createProduct';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { ProductFactory } from '../../domain/product/productFactory';
import { IProductRepository } from '../repositories/productRepository/IProduct.repository';
import { Product } from '../../domain/product/product';
import { IProductMessagesService } from './interfaces/IProductMessages.service';
import { TRANSACTION_SERVICE } from '../../../infrastructure/transaction/shared/constants';
import { SALES_CONTEXT_NAME, SALES_PRODUCT_REPOSITORY } from '../shared/constants';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from '../../../infrastructure/idempotency/constants';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../infrastructure/messages/constants';
import { ProductCreated } from '../../domain/product/events/productCreated';
import { IProductIdempotencyService } from './interfaces/IProductIdempotency.service';
import { ProductOutputDto } from '../dto/output/productOutputDto';

@Injectable()
export class CreateProductService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
    @Inject(SALES_PRODUCT_IDEMPOTENCY_SERVICE)
    private readonly idempotencyService: IProductIdempotencyService,
    @Inject(SALES_PRODUCT_MESSAGES_SERVICE)
    private readonly messagesService: IProductMessagesService,
    private readonly factory: ProductFactory,
  ) {}

  async runTransaction(command: CreateProduct): Promise<CreateProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.create(command, transaction));
  }

  async create(command: CreateProduct, transaction: ITransaction): Promise<CreateProductOutputDto> {
    await this.idempotencyService.assertRequestIsIdempotent(transaction);
    const product = this.factory.create(command);
    const [savedProduct] = await this.saveChanges(product, transaction);
    return CreateProductOutputDto.from(savedProduct);
  }

  private saveChanges(product: Product, transaction: ITransaction): Promise<[Product, ...unknown[]]> {
    const outputDto = new ProductOutputDto(product.export());
    const event = new ProductCreated({
      data: { product: outputDto },
      aggregateId: outputDto.productId,
    });

    return Promise.all([
      this.repo.save(product, transaction),
      this.idempotencyService.insertRequest(outputDto, transaction),
      this.messagesService.insertEvent(event, SALES_CONTEXT_NAME, transaction),
    ]);
  }
}
