import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';
import {
  UpdateProductInfoOutputDto
} from '../../../../src/sales/application/product/dto/output/updateProductInfoOutput.dto';
import { UpdateProductInfo } from '../../../../src/sales/domain/product/commands/updateProductInfo';

export function requestUpdateProductInfo(
  app: INestApplication,
  updateProductInfoPath: string,
  correlationId: string,
  requestBody: UpdateProductInfo,
): Promise<{ body: UpdateProductInfoOutputDto, status: HttpStatus }> {
  return request(app.getHttpServer())
    .put(updateProductInfoPath)
    .set(CORRELATION_ID_HEADER, correlationId)
    .send(requestBody);
}
