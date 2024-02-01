import { ITransactionService } from '../../../../infrastructure/transaction/ITransaction.service';
import { IProductRepository } from '../../../dal/product/repositories/productRepository/IProduct.repository';
import { DeleteProductParamsDto } from '../dto/input/deleteProductParams.dto';
import { DeleteProductOutputDto } from '../dto/output/deleteProductOutputDto';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { GetProductByIdQuery } from '../queries/getProductById.query';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../../../../infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../../shared/constants';

@Injectable()
export class DeleteProductService {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
    private readonly getProductByIdQuery: GetProductByIdQuery,
    private readonly time: TimeService,
  ) {}

  async runTransaction(dto: DeleteProductParamsDto): Promise<DeleteProductOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.deleteProduct(dto, transaction));
  }

  async deleteProduct(
    { productId }: DeleteProductParamsDto,
    transaction: ITransaction,
  ): Promise<DeleteProductOutputDto> {
    const product = await this.getProductByIdQuery.run({ productId }, transaction);
    product.markAsRemoved({ time: this.time });
    const savedProduct = await this.repo.save(product, transaction);
    return DeleteProductOutputDto.from(savedProduct);
  }
}
