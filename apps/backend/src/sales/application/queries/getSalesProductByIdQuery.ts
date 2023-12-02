import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectSalesProductRepository } from '../shared/decorators/injectSalesProductRepository';
import { ISalesProductRepository } from '../repositories/ISalesProduct.repository';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { PRODUCT_NOT_FOUND } from '../../../infrastructure/shared/errorMessages';

@Injectable()
export class GetSalesProductByIdQuery {
  constructor(
    @InjectSalesProductRepository()
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
