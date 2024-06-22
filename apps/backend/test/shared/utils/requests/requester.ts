import { HttpStatus } from '@nestjs/common';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { getAllSalesPaths } from '../getAllSalesPaths';
import { ulid } from 'ulid';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { plainToInstance } from 'class-transformer';
import { AdjustPrice } from '../../../../src/sales/domain/product/commands/adjustPrice';
import { AdjustPriceOutputDto } from '../../../../src/sales/application/product/dto/output/adjustPriceOutput.dto';

export class Requester {
  private readonly paths: ReturnType<typeof getAllSalesPaths>;

  constructor(
    private readonly app: NestFastifyApplication,
  ) {
    this.paths = getAllSalesPaths();
  }

  async createProduct(params: CreateProductParams): Promise<{ body: CreateProductOutputDto, status: HttpStatus }> {
    const correlationId = params.correlationId ?? ulid();

    const result = await this.app
      .inject({
        method: 'POST',
        url: this.paths.createProductPath,
        headers: {
          [CORRELATION_ID_HEADER]: correlationId,
        },
        body: params.dto
      });

    const body = plainToInstance(CreateProductOutputDto, JSON.parse(result.body) as CreateProductOutputDto);

    return { body, status: result.statusCode };
  }

  async adjustPrice(params: AdjustPriceParams): Promise<{ body: AdjustPriceOutputDto, status: HttpStatus }> {
    const correlationId = params.correlationId ?? ulid();

    const result = await this.app
      .inject({
        method: 'PUT',
        url: this.paths.adjustPricePath,
        headers: {
          [CORRELATION_ID_HEADER]: correlationId,
        },
        body: params.dto
      });

    const body = plainToInstance(AdjustPriceOutputDto, JSON.parse(result.body) as AdjustPriceOutputDto);

    return { body, status: result.statusCode };
  }
}

interface CreateProductParams {
  dto: CreateProduct,
  correlationId?: string,
}

interface AdjustPriceParams {
  dto: AdjustPrice,
  correlationId: string,
}
