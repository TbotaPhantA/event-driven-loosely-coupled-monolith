import { Injectable } from '@nestjs/common';
import {
  InjectTransactionService,
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { AdjustPriceOutputDto } from '../dto/output/adjustPriceOutput.dto';
import { AdjustPrice } from '../../domain/salesProduct/commands/adjustPrice';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetSalesProductByIdQuery } from '../queries/getSalesProductByIdQuery';
import { TimeService } from '../../../infrastructure/time/time.service';

@Injectable()
export class AdjustPriceService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
    private readonly repo: ISalesProductRepository,
    private readonly getSalesProductByIdQuery: GetSalesProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(command: AdjustPrice): Promise<AdjustPriceOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.adjustPrice(command, transaction));
  }

  async adjustPrice(command: AdjustPrice, transaction: ITransaction): Promise<AdjustPriceOutputDto> {
    const product = await this.getSalesProductByIdQuery.run(command, transaction);
    product.adjustPrice(command, { time: this.time });
    const savedProduct = await this.repo.save(product, transaction);
    return AdjustPriceOutputDto.from(savedProduct);
  }
}
