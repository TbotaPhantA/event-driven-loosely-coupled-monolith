import { Product } from '../../../../domain/product/product';
import { ProductOutputDto } from './productOutputDto';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';
import { Link } from './links/link';
import { createProductLinksFrom } from './links/utils/createProductLinksFrom';

export class CreateProductOutputDto {
  @ApiProperty({ type: ProductOutputDto })
  product!: ProductOutputDto;

  @ApiProperty({ type: [Link] })
  links!: Link[];

  static createByRaw(raw: NoMethods<CreateProductOutputDto>): CreateProductOutputDto {
    const dto = new CreateProductOutputDto();
    dto.product = raw.product;
    dto.links = raw.links;
    return dto;
  }

  static from(product: Product): CreateProductOutputDto {
    const exported = product.export();
    const output = new ProductOutputDto(exported);
    const links = createProductLinksFrom(exported);
    return CreateProductOutputDto.createByRaw({ product: output, links });
  }
}
