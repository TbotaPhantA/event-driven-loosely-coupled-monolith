import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../repositories/productRepository/IProduct.repository';
import { ITransaction } from '../../../../infrastructure/transaction/shared/types/ITransaction';
import { Product } from '../../../domain/product/product';
import { PRODUCT_NOT_FOUND } from '../../../../infrastructure/shared/errorMessages';
import { SALES_PRODUCT_REPOSITORY } from '../../shared/constants';

@Injectable()
export class GetProductByIdQuery {
  constructor(
    @Inject(SALES_PRODUCT_REPOSITORY)
    private readonly repo: IProductRepository,
  ) {}

  async run({ productId }: { productId: string }, transaction: ITransaction): Promise<Product> {
    const product = await this.repo.findOneById(productId, transaction);

    if (!product) {
      throw new BadRequestException(PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
