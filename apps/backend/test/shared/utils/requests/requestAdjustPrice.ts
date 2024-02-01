import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AdjustPrice } from '../../../../src/sales/domain/product/commands/adjustPrice';
import { AdjustPriceOutputDto } from '../../../../src/sales/application/product/dto/output/adjustPriceOutput.dto';
import { CORRELATION_ID_HEADER } from '../../../../src/infrastructure/correlation';

export function requestAdjustPrice(
  app: INestApplication,
  adjustPricePath: string,
  correlationId: string,
  requestBody: AdjustPrice,
): Promise<{ body: AdjustPriceOutputDto, status: HttpStatus }> {
  return request(app.getHttpServer())
    .put(adjustPricePath)
    .set(CORRELATION_ID_HEADER, correlationId)
    .send(requestBody);
}
