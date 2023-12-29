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
    const salesProduct = new SalesProductOutputDto(product);
    const links: Link[] = createSalesProductLinksFrom(product) ;

    return new UpdateProductInfoOutputDto({ salesProduct, links });
  }
}
