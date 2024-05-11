import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Validate } from '../../../infrastructure/shared/decorators/validate';
import { HttpExceptionFilter } from '../../../infrastructure/shared/exceptionFilters/httpException.filter';
import { storageInventoryItemResource } from '../shared/resources';
import { GetAllInventoryItemsOutputDto } from './dto/output/getAllInventoryItemsOutput.dto';
import { GetAllInventoryItemsDto } from './dto/input/getAllInventoryItems.dto';
import { InventoryItemReadService } from './services/inventoryItemRead.service';

@Controller(storageInventoryItemResource)
@ApiTags(storageInventoryItemResource)
@Validate()
@UseFilters(HttpExceptionFilter)
export class InventoryItemController {
  constructor(
    private readonly inventoryItemReadService: InventoryItemReadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory items by filter' })
  @ApiResponse({ type: GetAllInventoryItemsOutputDto })
  async getAllInventoryItems(
    @Query() queryParams: GetAllInventoryItemsDto,
  ): Promise<GetAllInventoryItemsOutputDto> {
    return this.inventoryItemReadService.getAllInventoryItems(queryParams);
  }
}
