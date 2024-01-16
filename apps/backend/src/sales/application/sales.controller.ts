import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Link } from './dto/output/links/link';
import { NoMethods } from '../../infrastructure/shared/types/noMethods';
import { CreateSalesProductLink } from './dto/output/links/createSalesProduct.link';
import { Controller, Get } from '@nestjs/common';

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

@Controller('sales')
export class SalesController {
  @Get('entry-links')
  @ApiOperation({ summary: 'Get entry links for the sales context' })
  @ApiResponse({ type: GetEntryLinksOutputDto })
  getEntryLinks(): GetEntryLinksOutputDto {
    return GetEntryLinksOutputDto.create();
  }
}
