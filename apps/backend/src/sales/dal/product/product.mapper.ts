import { ProductEntity } from './product.entity';
import { Product } from '../../domain/product/product';

export class ProductMapper {
  static toEntity(product: Product): ProductEntity {
    const exported = product.export();
    return ProductEntity.createByRaw({
      productId: exported.productId,
      name: exported.name,
      price: exported.price,
      description: exported.description,
      createdAt: exported.createdAt,
      updatedAt: exported.updatedAt,
      removedAt: exported.removedAt,
    });
  }

  static toDomain(entity: ProductEntity): Product {
    return new Product({
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
