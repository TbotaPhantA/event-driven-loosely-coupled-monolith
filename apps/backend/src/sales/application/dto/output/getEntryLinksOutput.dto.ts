import { ApiProperty } from '@nestjs/swagger';
import { Link } from './links/link';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { CreateSalesProductLink } from './links/createSalesProduct.link';

export class GetEntryLinksOutputDto {
  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<GetEntryLinksOutputDto>) {
    this.links = raw.links;
  }

  static create(): GetEntryLinksOutputDto {
    return new GetEntryLinksOutputDto({
      links: [CreateSalesProductLink.create()],
    });
  }
}
