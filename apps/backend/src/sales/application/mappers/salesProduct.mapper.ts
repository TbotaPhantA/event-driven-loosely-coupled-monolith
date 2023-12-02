import { SalesProductEntity } from '../entities/salesProduct.entity';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';

export class SalesProductMapper {
  static toEntity(product: SalesProduct): SalesProductEntity {
    return new SalesProductEntity({
      productId: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
    });
  }

  static toDomain(entity: SalesProductEntity): SalesProduct {
    return new SalesProduct({
      productId: entity.productId,
      name: entity.name,
      price: entity.price,
      description: entity.description,
    });
  }
}
