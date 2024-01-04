import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ISalesProductRepository } from '../repositories/salesProductRepository/ISalesProduct.repository';
import { DeleteSalesProductParamsDto } from '../dto/input/deleteSalesProductParams.dto';
import { DeleteSalesProductOutputDto } from '../dto/output/deleteSalesProductOutput.dto';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetSalesProductByIdQuery } from '../queries/getSalesProductByIdQuery';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../../../infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../shared/constants';

@Injectable()
export class DeleteSalesProductService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: ISalesProductRepository,
    private readonly getSalesProductByIdQuery: GetSalesProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(dto: DeleteSalesProductParamsDto): Promise<DeleteSalesProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.deleteSalesProduct(dto, transaction));
  }

  async deleteSalesProduct(
    { productId }: DeleteSalesProductParamsDto,
    transaction: ITransaction,
  ): Promise<DeleteSalesProductOutputDto> {
    const product = await this.getSalesProductByIdQuery.run({ productId }, transaction);
    product.markAsRemoved({ time: this.time });
    const savedProduct = await this.repo.save(product, transaction);
    return DeleteSalesProductOutputDto.from(savedProduct);
  }
}
