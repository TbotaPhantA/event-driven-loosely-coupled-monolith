import { Inject, Injectable } from '@nestjs/common';
import { ITransactionService } from '../../../../infrastructure/transaction/ITransaction.service';
import { IProductRepository } from '../../../dal/product/repositories/productRepository/IProduct.repository';
import { AdjustPriceOutputDto } from '../dto/output/adjustPriceOutput.dto';
import { AdjustPrice } from '../../../domain/product/commands/adjustPrice';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { GetProductByIdQuery } from '../queries/getProductById.query';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { SALES_PRODUCT_REPOSITORY } from '../../shared/constants';
import { TRANSACTION_SERVICE } from '../../../../infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../../infrastructure/messages/constants';
import { IProductMessagesService } from './interfaces/IProductMessages.service';

@Injectable()
export class AdjustPriceService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
    @Inject(SALES_PRODUCT_MESSAGES_SERVICE)
    private readonly messagesService: IProductMessagesService,
    private readonly getProductByIdQuery: GetProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(command: AdjustPrice): Promise<AdjustPriceOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.adjustPrice(command, transaction));
  }

  async adjustPrice(command: AdjustPrice, transaction: ITransaction): Promise<AdjustPriceOutputDto> {
    const product = await this.getProductByIdQuery.run(command, transaction);
    product.adjustPrice(command, { time: this.time });
    const [savedProduct] = await Promise.all([
      this.repo.save(product, transaction),
      this.messagesService.insertEvents(product.exportUncommittedEvents(), transaction),
    ]);
    return AdjustPriceOutputDto.from(savedProduct);
  }
}
