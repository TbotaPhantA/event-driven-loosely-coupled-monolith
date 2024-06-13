import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { getAllSalesPaths } from '../getAllSalesPaths';
import { ulid } from 'ulid';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';

interface CreateProductParams {
  dto: CreateProduct,
  correlationId?: string,
}

export class Requester {
  private readonly paths: ReturnType<typeof getAllSalesPaths>;

  constructor(
    private readonly app: INestApplication,
  ) {
    this.paths = getAllSalesPaths();
  }

  async createProduct(params: CreateProductParams): Promise<{ body: CreateProductOutputDto, status: HttpStatus }> {
    const correlationId = params.correlationId ?? ulid();

    return request(this.app.getHttpServer())
      .post(this.paths.createProductPath)
      .set(CORRELATION_ID_HEADER, correlationId)
      .send(params.dto)
  }
}
