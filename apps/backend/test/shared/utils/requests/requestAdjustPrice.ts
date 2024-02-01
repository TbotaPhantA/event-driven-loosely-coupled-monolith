import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AdjustPrice } from '../../../../src/sales/domain/product/commands/adjustPrice';
import { AdjustPriceOutputDto } from '../../../../src/sales/application/product/dto/output/adjustPriceOutput.dto';

export function requestAdjustPrice(
  app: INestApplication,
  path: string,
  requestBody: AdjustPrice,
): Promise<{ body: AdjustPriceOutputDto, status: HttpStatus }> {
  return request(app.getHttpServer())
    .put(path)
    .send(requestBody);
}
