import { CreateSalesProduct } from '../domain/salesProduct/commands/createSalesProduct';
import { Body, Controller, Delete, Param, Post, Put, UseFilters } from '@nestjs/common';
import { CreateSalesProductOutputDto } from './dto/output/createSalesProductOutput.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSalesProductService } from './services/createSalesProduct.service';
import { AdjustPrice } from '../domain/salesProduct/commands/adjustPrice';
import { AdjustPriceOutputDto } from './dto/output/adjustPriceOutput.dto';
import { AdjustPriceService } from './services/adjustPrice.service';
import { UpdateProductInfo } from '../domain/salesProduct/commands/updateProductInfo';
import { UpdateProductInfoOutputDto } from './dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfoService } from './services/updateProductInfo.service';
import { DeleteSalesProductOutputDto } from './dto/output/deleteSalesProductOutput.dto';
import { DeleteSalesProductParamsDto } from './dto/input/deleteSalesProductParams.dto';
import { DeleteSalesProductService } from './services/deleteSalesProduct.service';
import { Validate } from '../../infrastructure/shared/decorators/validate';
import { HttpExceptionFilter } from '../../infrastructure/shared/exceptionFilters/httpException.filter';

@Controller('sales/product')
@ApiTags('sales/product')
@Validate()
@UseFilters(HttpExceptionFilter)
export class SalesProductController {
  constructor(
    private readonly createSalesProductService: CreateSalesProductService,
    private readonly adjustPriceService: AdjustPriceService,
    private readonly updateProductInfoService: UpdateProductInfoService,
    private readonly deleteSalesProductService: DeleteSalesProductService,
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

  @Delete('delete-sales-product/:productId')
  @ApiOperation({ summary: 'Delete the sales product' })
  @ApiResponse({ type: DeleteSalesProductOutputDto })
  async deleteSalesProduct(
    @Param() dto: DeleteSalesProductParamsDto,
  ): Promise<DeleteSalesProductOutputDto> {
    return this.deleteSalesProductService.runTransaction(dto);
  }
}
