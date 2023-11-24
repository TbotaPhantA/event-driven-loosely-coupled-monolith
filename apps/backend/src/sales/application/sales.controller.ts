import { CreateSalesProduct } from '../domain/salesProduct/commands/createSalesProduct';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateSalesProductOutputDto } from './dto/output/createSalesProductOutput.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSalesProductService } from './services/createSalesProduct.service';

@Controller('sales/product')
@ApiTags('sales/product')
export class SalesProductController {
  constructor(
    private readonly createSalesProductService: CreateSalesProductService,
  ) {}

  @Post('create-sales-product')
  @ApiOperation({ summary: 'Create sales product' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateSalesProductOutputDto,
  })
  async createSalesProduct(
    @Body() command: CreateSalesProduct,
  ): Promise<CreateSalesProductOutputDto> {
    return this.createSalesProductService.runTransaction(command);
  }
}
