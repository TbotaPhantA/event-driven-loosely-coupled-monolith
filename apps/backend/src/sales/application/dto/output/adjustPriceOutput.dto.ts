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
    const salesProduct = new SalesProductOutputDto(product);
    const links: Link[] = createSalesProductLinksFrom(product);

    return new AdjustPriceOutputDto({ salesProduct, links });
  }
}
