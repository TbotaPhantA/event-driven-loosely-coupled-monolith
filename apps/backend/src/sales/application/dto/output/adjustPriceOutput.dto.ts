import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from './links/link';
import { createSalesProductLinksFrom } from './links/utils/createSalesProductLinksFrom';

export class AdjustPriceOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<AdjustPriceOutputDto>) {
    this.salesProduct = raw.salesProduct;
    this.links = raw.links;
  }

  static from(product: SalesProduct): AdjustPriceOutputDto {
    const exported = product.export();
    const salesProduct = new SalesProductOutputDto(exported);
    const links: Link[] = createSalesProductLinksFrom(exported);

    return new AdjustPriceOutputDto({ salesProduct, links });
  }
}
