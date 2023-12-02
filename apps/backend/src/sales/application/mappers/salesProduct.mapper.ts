import { SalesProductEntity } from '../entities/salesProduct.entity';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';

export class SalesProductMapper {
  static toEntity(product: SalesProduct): SalesProductEntity {
    return SalesProductEntity.createByRaw({
      productId: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      removedAt: product.removedAt,
    });
  }

  static toDomain(entity: SalesProductEntity): SalesProduct {
    return new SalesProduct({
      productId: entity.productId,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      removedAt: entity.removedAt,
    });
  }
}
