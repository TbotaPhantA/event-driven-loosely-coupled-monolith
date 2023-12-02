import { CreateSalesProduct } from '../domain/salesProduct/commands/createSalesProduct';
import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateSalesProductOutputDto } from './dto/output/createSalesProductOutput.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSalesProductService } from './services/createSalesProduct.service';
import { AdjustPrice } from '../domain/salesProduct/commands/adjustPrice';
import { AdjustPriceOutputDto } from './dto/output/adjustPriceOutput.dto';
import { AdjustPriceService } from './services/adjustPrice.service';
import { UpdateProductInfo } from '../domain/salesProduct/commands/updateProductInfo';
import { UpdateProductInfoOutputDto } from './dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfoService } from './services/updateProductInfo.service';

@Controller('sales/product')
@ApiTags('sales/product')
export class SalesProductController {
  constructor(
    private readonly createSalesProductService: CreateSalesProductService,
    private readonly adjustPriceService: AdjustPriceService,
    private readonly updateProductInfoService: UpdateProductInfoService,
  ) {}

  @Post('create-sales-product')
  @ApiOperation({ summary: 'Create sales product' })
  @ApiResponse({ type: CreateSalesProductOutputDto })
  async createSalesProduct(@Body() command: CreateSalesProduct): Promise<CreateSalesProductOutputDto> {
    return this.createSalesProductService.runTransaction(command);
  }

  @Put('adjust-price')
  @ApiOperation({ summary: 'Adjust price of the product' })
  @ApiResponse({ type: AdjustPriceOutputDto })
  async adjustPrice(
    @Body() command: AdjustPrice,
  ): Promise<AdjustPriceOutputDto> {
    return this.adjustPriceService.runTransaction(command);
  }

  @Put('update-product-info')
  @ApiOperation({ summary: 'Update the product name and description' })
  @ApiResponse({ type: UpdateProductInfoOutputDto })
  async updateProductInfo(
    @Body() command: UpdateProductInfo,
  ): Promise<UpdateProductInfoOutputDto> {
    return this.updateProductInfoService.runTransaction(command);
  }
}
