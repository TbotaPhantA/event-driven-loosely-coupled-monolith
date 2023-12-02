import {
  InjectTransactionService
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { DeleteSalesProductParamsDto } from '../dto/input/deleteSalesProductParams.dto';
import { DeleteSalesProductOutputDto } from '../dto/output/deleteSalesProductOutput.dto';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetSalesProductByIdQuery } from '../queries/getSalesProductByIdQuery';
import { TimeService } from '../../../infrastructure/time/time.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteSalesProductService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
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
