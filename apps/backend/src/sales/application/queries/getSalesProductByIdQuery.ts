import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISalesProductRepository } from '../repositories/salesProductRepository/ISalesProduct.repository';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { PRODUCT_NOT_FOUND } from '../../../infrastructure/shared/errorMessages';
import { SALES_PRODUCT_REPOSITORY } from '../shared/constants';

@Injectable()
export class GetSalesProductByIdQuery {
  constructor(
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: ISalesProductRepository,
  ) {}

  async run({ productId }: { productId: string }, transaction: ITransaction): Promise<SalesProduct> {
    const product = await this.repo.findOneById(productId, transaction);

    if (!product) {
      throw new BadRequestException(PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
