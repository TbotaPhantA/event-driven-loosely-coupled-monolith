import { SalesProductEntity } from '../entities/salesProduct.entity';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';

export class SalesProductMapper {
  static toEntity(product: SalesProduct): SalesProductEntity {
    const exported = product.export();
    return SalesProductEntity.createByRaw({
      productId: exported.productId,
      name: exported.name,
      price: exported.price,
      description: exported.description,
      createdAt: exported.createdAt,
      updatedAt: exported.updatedAt,
      removedAt: exported.removedAt,
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
