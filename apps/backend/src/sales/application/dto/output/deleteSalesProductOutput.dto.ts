import { SalesProductOutputDto } from './salesProductOutputDto';
import { SalesProduct } from '../../../domain/salesProduct/salesProduct';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Link } from './links/link';
import { createSalesProductLinksFrom } from './links/utils/createSalesProductLinksFrom';

export class DeleteSalesProductOutputDto {
  @ApiProperty({ type: SalesProductOutputDto })
  salesProduct: SalesProductOutputDto;

  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<DeleteSalesProductOutputDto>) {
    this.salesProduct = raw.salesProduct;
    this.links = raw.links;
  }

  static from(product: SalesProduct): DeleteSalesProductOutputDto {
    const exported = product.export();
    const salesProduct = new SalesProductOutputDto(exported);
    const links: Link[] = createSalesProductLinksFrom(exported);

    return new DeleteSalesProductOutputDto({ salesProduct, links });
  }
}
