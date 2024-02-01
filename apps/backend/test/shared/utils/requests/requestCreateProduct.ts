import {
  CreateProductOutputDto,
} from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';

export function requestCreateProduct(
  app: INestApplication,
  createProductPath: string,
  correlationId: string,
  requestBody: CreateProduct,
): Promise<{ body: CreateProductOutputDto, status: HttpStatus }> {
  return request(app.getHttpServer())
    .post(createProductPath)
    .set(CORRELATION_ID_HEADER, correlationId)
    .send(requestBody)
}
