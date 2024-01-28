import {
  CreateSalesProductOutputDto,
} from '../../../../src/sales/application/dto/output/createSalesProductOutput.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import { CreateSalesProduct } from '../../../../src/sales/domain/salesProduct/commands/createSalesProduct';

export function requestCreateProduct(
  app: INestApplication,
  createProductPath: string,
  correlationId: string,
  requestBody: CreateSalesProduct,
): Promise<{ body: CreateSalesProductOutputDto, status: HttpStatus }> {
  return request(app.getHttpServer())
    .post(createProductPath)
    .set(CORRELATION_ID_HEADER, correlationId)
    .send(requestBody)
}
