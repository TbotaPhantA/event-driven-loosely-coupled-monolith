import { Inject, Injectable } from '@nestjs/common';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { IProductRepository } from '../repositories/productRepository/IProductRepository';
import { UpdateProductInfoOutputDto } from '../dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfo } from '../../domain/product/commands/updateProductInfo';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetProductByIdQuery } from '../queries/getProductById.query';
import { TimeService } from '../../../infrastructure/time/time.service';
import { TRANSACTION_SERVICE } from '../../../infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../shared/constants';

@Injectable()
export class UpdateProductInfoService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
    private readonly getProductByIdQuery: GetProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(command: UpdateProductInfo): Promise<UpdateProductInfoOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.updateProductInfo(command, transaction));
  }

  async updateProductInfo(command: UpdateProductInfo, transaction: ITransaction): Promise<UpdateProductInfoOutputDto> {
    const product = await this.getProductByIdQuery.run(command, transaction);
    product.updateProductInfo(command, { time: this.time });
    const savedProduct = await this.repo.save(product, transaction);
    return UpdateProductInfoOutputDto.from(savedProduct);
  }
}
