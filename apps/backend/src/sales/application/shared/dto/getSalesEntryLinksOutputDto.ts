import { ApiProperty } from '@nestjs/swagger';
import { Link } from '../../product/dto/output/links/link';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { CreateProductLink } from '../../product/dto/output/links/createProductLink';

export class GetSalesEntryLinksOutputDto {
  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<GetSalesEntryLinksOutputDto>) {
    this.links = raw.links;
  }

  static create(): GetSalesEntryLinksOutputDto {
    return new GetSalesEntryLinksOutputDto({
      links: [CreateProductLink.create()],
    });
  }
}
