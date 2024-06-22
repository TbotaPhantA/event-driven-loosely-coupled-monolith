import { HttpStatus } from '@nestjs/common';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { getAllSalesPaths } from '../getAllSalesPaths';
import { ulid } from 'ulid';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { plainToInstance } from 'class-transformer';

interface CreateProductParams {
  dto: CreateProduct,
  correlationId?: string,
}

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
}
