import { Product } from '../../../../domain/product/product';
import { ProductOutputDto } from './productOutputDto';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from './links/link';
import { createProductLinksFrom } from './links/utils/createProductLinksFrom';

export class AdjustPriceOutputDto {
  @ApiProperty({ type: ProductOutputDto })
  product!: ProductOutputDto;

  @ApiProperty({ type: [Link] })
  links!: Link[];

  static createByRaw(raw: NoMethods<AdjustPriceOutputDto>): AdjustPriceOutputDto {
    const dto = new AdjustPriceOutputDto();
    dto.product = raw.product;
    dto.links = raw.links;
    return dto;
  }

  static from(product: Product): AdjustPriceOutputDto {
    const exported = product.export();
    const output = new ProductOutputDto(exported);
    const links: Link[] = createProductLinksFrom(exported);

    return AdjustPriceOutputDto.createByRaw({ product: output, links });
  }
}
