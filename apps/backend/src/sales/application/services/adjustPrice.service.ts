import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InjectTransactionService
} from '../../../infrastructure/transaction/shared/decorators/injectTransactionService';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { ITransactionService } from '../../../infrastructure/transaction/ITransaction.service';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { AdjustPriceOutputDto } from '../dto/output/adjustPriceOutput.dto';
import { AdjustPrice } from '../../domain/salesProduct/commands/adjustPrice';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { PRODUCT_NOT_FOUND } from '../../../infrastructure/shared/errorMessages';

@Injectable()
export class AdjustPriceService {
  constructor(
    @InjectTransactionService()
    private readonly transactionService: ITransactionService,
    @InjectSalesProductRepository()
    private readonly repo: ISalesProductRepository,
  ) {}

  async runTransaction(command: AdjustPrice): Promise<AdjustPriceOutputDto> {
    return this.transactionService.withTransaction('SERIALIZABLE', (transaction) =>
      this.adjustPrice(command, transaction));
  }

  async adjustPrice(command: AdjustPrice, transaction: ITransaction): Promise<AdjustPriceOutputDto> {
    const product = await this.getOneById(command, transaction);
    product.adjustPrice(command);
    const savedProduct = await this.repo.save(product, transaction);
    return AdjustPriceOutputDto.from(savedProduct);
  }

  private async getOneById(command: Pick<AdjustPrice, 'productId'>, transaction: ITransaction): Promise<SalesProduct> {
    const product = await this.repo.findOneById(command.productId, transaction);

    if (!product) {
      throw new BadRequestException(PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
