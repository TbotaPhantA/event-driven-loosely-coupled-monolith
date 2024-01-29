import { CreateProduct } from '../domain/product/commands/createProduct';
import { Body, Controller, Delete, Param, Post, Put, UseFilters } from '@nestjs/common';
import { CreateProductOutputDto } from './dto/output/createProductOutputDto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductService } from './services/createProduct.service';
import { AdjustPrice } from '../domain/product/commands/adjustPrice';
import { AdjustPriceOutputDto } from './dto/output/adjustPriceOutput.dto';
import { AdjustPriceService } from './services/adjustPrice.service';
import { UpdateProductInfo } from '../domain/product/commands/updateProductInfo';
import { UpdateProductInfoOutputDto } from './dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfoService } from './services/updateProductInfo.service';
import { DeleteProductOutputDto } from './dto/output/deleteProductOutputDto';
import { DeleteProductParamsDto } from './dto/input/deleteProductParams.dto';
import { DeleteProductService } from './services/deleteProduct.service';
import { Validate } from '../../infrastructure/shared/decorators/validate';
import { HttpExceptionFilter } from '../../infrastructure/shared/exceptionFilters/httpException.filter';
import { CORRELATION_ID_HEADER } from '../../infrastructure/correlation';
import {
  adjustPriceResource,
  createProductResource,
  deleteProductResource,
  salesProductResource,
  updateProductInfoResource
} from './shared/resources';

@Controller(salesProductResource)
@ApiTags(salesProductResource)
@Validate()
@UseFilters(HttpExceptionFilter)
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly adjustPriceService: AdjustPriceService,
    private readonly updateProductInfoService: UpdateProductInfoService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @Post(createProductResource)
  @ApiOperation({ summary: 'Create sales product' })
  @ApiResponse({ type: CreateProductOutputDto })
  @ApiHeader({ name: CORRELATION_ID_HEADER })
  async createProduct(@Body() command: CreateProduct): Promise<CreateProductOutputDto> {
    return this.createProductService.runTransaction(command);
  }

  @Put(adjustPriceResource)
  @ApiOperation({ summary: 'Adjust price of the product' })
  @ApiResponse({ type: AdjustPriceOutputDto })
  async adjustPrice(
    @Body() command: AdjustPrice,
  ): Promise<AdjustPriceOutputDto> {
    return this.adjustPriceService.runTransaction(command);
  }

  @Put(updateProductInfoResource)
  @ApiOperation({ summary: 'Update the product name and description' })
  @ApiResponse({ type: UpdateProductInfoOutputDto })
  async updateProductInfo(
    @Body() command: UpdateProductInfo,
  ): Promise<UpdateProductInfoOutputDto> {
    return this.updateProductInfoService.runTransaction(command);
  }

  @Delete(`:productId/${deleteProductResource}`)
  @ApiOperation({ summary: 'Delete the sales product' })
  @ApiResponse({ type: DeleteProductOutputDto })
  async deleteProduct(
    @Param() dto: DeleteProductParamsDto,
  ): Promise<DeleteProductOutputDto> {
    return this.deleteProductService.runTransaction(dto);
  }
}
