import { sales_products } from '../entities/sales_products.table';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';

export class SalesProductMapper {
  static toEntity(product: SalesProduct): sales_products {
    const exported = product.export();
    return sales_products.createByRaw({
      product_id: exported.productId,
      name: exported.name,
      price: exported.price,
      description: exported.description,
      created_at: exported.createdAt,
      updated_at: exported.updatedAt,
      removed_at: exported.removedAt,
    });
  }

  static toDomain(entity: sales_products): SalesProduct {
    return new SalesProduct({
      productId: entity.product_id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      removedAt: entity.removed_at,
    });
  }
}
