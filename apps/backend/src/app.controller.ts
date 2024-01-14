import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Link } from './sales/application/dto/output/links/link';
import { NoMethods } from './infrastructure/shared/types/noMethods';
import { CreateSalesProductLink } from './sales/application/dto/output/links/createSalesProduct.link';

class EntryLinkOutputDto {
  @ApiProperty({ type: [Link] })
  links: Link[];

  constructor(raw: NoMethods<EntryLinkOutputDto>) {
    this.links = raw.links;
  }

  static create(): EntryLinkOutputDto {
    return new EntryLinkOutputDto({
      links: [
        CreateSalesProductLink.create(),
      ]
    });
  }
}

@Controller()
export class AppController {
  @Get('entry-links')
  @ApiOperation({ summary: 'Get entry links for the backend' })
  @ApiResponse({ type: EntryLinkOutputDto })
  getEntryLinks(): EntryLinkOutputDto {
    return EntryLinkOutputDto.create();
  }
}
