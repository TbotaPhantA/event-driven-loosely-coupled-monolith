import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from './salesProductOutputDto';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Link } from './links/link';
import { createSalesProductLinksFrom } from './links/utils/createSalesProductLinksFrom';

export class UpdateProductInfoOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<UpdateProductInfoOutputDto>) {
    this.salesProduct = raw.salesProduct;
    this.links = raw.links;
  }

  static from(product: SalesProduct): UpdateProductInfoOutputDto {
    const exported = product.export();
    const salesProduct = new SalesProductOutputDto(exported);
    const links: Link[] = createSalesProductLinksFrom(exported) ;

    return new UpdateProductInfoOutputDto({ salesProduct, links });
  }
}
