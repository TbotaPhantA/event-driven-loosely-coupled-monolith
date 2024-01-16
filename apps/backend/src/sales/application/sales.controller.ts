import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { GetEntryLinksOutputDto } from './dto/output/getEntryLinksOutput.dto';

@Controller('sales')
export class SalesController {
  @Get('entry-links')
  @ApiOperation({ summary: 'Get entry links for the sales context' })
  @ApiResponse({ type: GetEntryLinksOutputDto })
  getEntryLinks(): GetEntryLinksOutputDto {
    return GetEntryLinksOutputDto.create();
  }
}
