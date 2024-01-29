import { CreateProductLink } from '../createProductLink';
import { AdjustPriceLink } from '../adjustPrice.link';
import { UpdateProductInfoLink } from '../updateProductInfo.link';
import { DeleteProductLink } from '../deleteProductLink';
import type { Link } from '../link';

export const createProductLinksFrom = (product: { productId: string }): Link[] => {
  return [
    CreateProductLink.create(),
    AdjustPriceLink.from(product),
    UpdateProductInfoLink.from(product),
    DeleteProductLink.from(product),
  ]
}
