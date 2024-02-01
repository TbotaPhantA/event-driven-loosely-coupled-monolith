import { IProductRepository } from './IProduct.repository';
import { Product } from '../../../../domain/product/product';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductMapper } from '../../mappers/product.mapper';

@Injectable()
export class DatabaseProductRepository implements IProductRepository {
  async findOneById(productId: string, transaction: EntityManager): Promise<Product | null> {
    const entity = await transaction.findOne(ProductEntity, {
      where: { productId },
    });

    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async save(product: Product, transaction: EntityManager): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    const savedEntity = await transaction.save(entity);
    return ProductMapper.toDomain(savedEntity);
  }
}
