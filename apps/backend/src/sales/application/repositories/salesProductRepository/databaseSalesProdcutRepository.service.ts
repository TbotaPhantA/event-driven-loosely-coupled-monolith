import { ISalesProductRepository } from './ISalesProduct.repository';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { sales_products } from '../../entities/sales_products.table';
import { SalesProductMapper } from '../../mappers/salesProduct.mapper';

@Injectable()
export class DatabaseSalesProductRepository implements ISalesProductRepository {
  async findOneById(productId: string, transaction: EntityManager): Promise<SalesProduct | null> {
    const entity = await transaction.findOne(sales_products, {
      where: { product_id: productId },
    });

    return entity ? SalesProductMapper.toDomain(entity) : null;
  }

  async save(product: SalesProduct, transaction: EntityManager): Promise<SalesProduct> {
    const entity = SalesProductMapper.toEntity(product);
    const savedEntity = await transaction.save(entity);
    return SalesProductMapper.toDomain(savedEntity);
  }
}
