import { CreateSalesProduct } from '../domain/salesProduct/commands/createSalesProduct';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateSalesProductOutputDto } from './dto/output/createSalesProductOutput.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSalesProductService } from './services/createSalesProduct.service';
import { AdjustPrice } from '../domain/salesProduct/commands/adjustPrice';
import { AdjustPriceOutputDto } from './dto/output/adjustPriceOutput.dto';
import { AdjustPriceService } from './services/adjustPrice.service';

@Controller('sales/product')
@ApiTags('sales/product')
export class SalesProductController {
  constructor(
    private readonly createSalesProductService: CreateSalesProductService,
    private readonly adjustPriceService: AdjustPriceService,
  ) {}

  @Post('create-sales-product')
  @ApiOperation({ summary: 'Create sales product' })
  @ApiResponse({ type: CreateSalesProductOutputDto })
  async createSalesProduct(@Body() command: CreateSalesProduct): Promise<CreateSalesProductOutputDto> {
    return this.createSalesProductService.runTransaction(command);
  }

  @Post('adjust-price')
  @ApiOperation({ summary: 'Adjust price of the product' })
  @ApiResponse({ type: AdjustPriceOutputDto })
  async adjustPrice(
    @Body() command: AdjustPrice,
  ): Promise<AdjustPriceOutputDto> {
    return this.adjustPriceService.runTransaction(command);
  }
}
