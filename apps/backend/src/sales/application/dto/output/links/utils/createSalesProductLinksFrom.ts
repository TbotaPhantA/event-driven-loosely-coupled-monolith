import { SalesProduct } from '../../../../../domain/salesProduct/salesProduct';
import { CreateSalesProductLink } from '../createSalesProduct.link';
import { AdjustPriceLink } from '../adjustPrice.link';
import { UpdateProductInfoLink } from '../updateProductInfo.link';
import { DeleteSalesProductLink } from '../deleteSalesProduct.link';
import { Link } from '../link';

export const createSalesProductLinksFrom = (product: Pick<SalesProduct, 'productId'>): Link[] => {
  return [
    CreateSalesProductLink.create(),
    AdjustPriceLink.from(product),
    UpdateProductInfoLink.from(product),
    DeleteSalesProductLink.from(product),
  ]
}
