import { ISalesProductRepository } from './ISalesProduct.repository';
import { Injectable } from '@nestjs/common';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { ITransaction } from '../../../infrastructure/transaction/shared/types/ITransaction';

@Injectable()
export class InMemorySalesProductRepository implements ISalesProductRepository {
  private readonly map: Map<string, SalesProduct> = new Map<string, SalesProduct>();

  async save(
    product: SalesProduct,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transaction: ITransaction,
  ): Promise<SalesProduct> {
    this.map.set(product.productId, product);
    return product;
  }

  async findOneById(productId: string): Promise<SalesProduct | null> {
    const product = this.map.get(productId);
    if (!product) return null;
    return product;
  }
}
