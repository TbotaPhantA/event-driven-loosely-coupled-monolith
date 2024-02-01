import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { GetSalesEntryLinksOutputDto } from './shared/dto/getSalesEntryLinksOutputDto';

@Controller('sales')
export class SalesController {
  @Get('entry-links')
  @ApiOperation({ summary: 'Get entry links for the sales context' })
  @ApiResponse({ type: GetSalesEntryLinksOutputDto })
  getEntryLinks(): GetSalesEntryLinksOutputDto {
    return GetSalesEntryLinksOutputDto.create();
  }
}
