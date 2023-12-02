import { ISalesProductRepository } from './ISalesProduct.repository';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SalesProductEntity } from './entities/salesProduct.entity';
import { SalesProductMapper } from './salesProduct.mapper';

@Injectable()
export class DatabaseSalesProductRepository implements ISalesProductRepository {
  async findOneById(
    productId: string,
    transaction: EntityManager,
  ): Promise<SalesProduct | null> {
    const entity = await transaction.findOne(SalesProductEntity, {
      where: { productId },
    });

    return entity ? SalesProductMapper.toDomain(entity) : null;
  }

  async save(
    product: SalesProduct,
    transaction: EntityManager,
  ): Promise<SalesProduct> {
    const entity = SalesProductMapper.toEntity(product);
    const savedEntity = await transaction.save(entity);
    return SalesProductMapper.toDomain(savedEntity);
  }
}
