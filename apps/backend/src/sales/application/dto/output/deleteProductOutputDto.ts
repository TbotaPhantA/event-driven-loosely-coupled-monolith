import { ProductOutputDto } from './productOutputDto';
import { Product } from '../../../domain/product/product';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Link } from './links/link';
import { createProductLinksFrom } from './links/utils/createProductLinksFrom';

export class DeleteProductOutputDto {
  @ApiProperty({ type: ProductOutputDto })
  product: ProductOutputDto;

  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<DeleteProductOutputDto>) {
    this.product = raw.product;
    this.links = raw.links;
  }

  static from(product: Product): DeleteProductOutputDto {
    const exported = product.export();
    const output = new ProductOutputDto(exported);
    const links = createProductLinksFrom(exported);

    return new DeleteProductOutputDto({ product: output, links });
  }
}
