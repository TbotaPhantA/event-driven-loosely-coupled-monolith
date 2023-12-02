import { Injectable } from '@nestjs/common';
import {
  InjectTransactionService
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { UpdateProductInfoOutputDto } from '../dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfo } from '../../domain/salesProduct/commands/updateProductInfo';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { GetSalesProductByIdQuery } from '../queries/getSalesProductByIdQuery';

@Injectable()
export class UpdateProductInfoService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
    private readonly repo: ISalesProductRepository,
    private readonly getSalesProductByIdQuery: GetSalesProductByIdQuery,
  ) {}

  async runTransaction(command: UpdateProductInfo): Promise<UpdateProductInfoOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.updateProductInfo(command, transaction));
  }

  async updateProductInfo(command: UpdateProductInfo, transaction: ITransaction): Promise<UpdateProductInfoOutputDto> {
    const product = await this.getSalesProductByIdQuery.run(command, transaction);
    product.updateProductInfo(command);
    const savedProduct = await this.repo.save(product, transaction);
    return UpdateProductInfoOutputDto.from(savedProduct);
  }
}
