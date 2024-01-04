import { Inject, Injectable } from '@nestjs/common';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ISalesProductRepository } from '../repositories/salesProductRepository/ISalesProduct.repository';
import { UpdateProductInfoOutputDto } from '../dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfo } from '../../domain/salesProduct/commands/updateProductInfo';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetSalesProductByIdQuery } from '../queries/getSalesProductByIdQuery';
import { TimeService } from '../../../infrastructure/time/time.service';
import { TRANSACTION_SERVICE } from '../../../infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../shared/constants';

@Injectable()
export class UpdateProductInfoService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: ISalesProductRepository,
    private readonly getSalesProductByIdQuery: GetSalesProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(command: UpdateProductInfo): Promise<UpdateProductInfoOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.updateProductInfo(command, transaction));
  }

  async updateProductInfo(command: UpdateProductInfo, transaction: ITransaction): Promise<UpdateProductInfoOutputDto> {
    const product = await this.getSalesProductByIdQuery.run(command, transaction);
    product.updateProductInfo(command, { time: this.time });
    const savedProduct = await this.repo.save(product, transaction);
    return UpdateProductInfoOutputDto.from(savedProduct);
  }
}
