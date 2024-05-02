import { GetSalesEntryLinksOutputDto } from '../../../../src/sales/application/shared/dto/getSalesEntryLinksOutputDto';
import * as request from 'supertest';
import { app } from '../../../acceptance/globalBeforeAndAfterAll';
import { entryLinksPaths } from '../../../../src/sales/application/shared/paths';

export async function requestSalesEntryLinks(): Promise<GetSalesEntryLinksOutputDto> {
  const response = await request(app.getHttpServer())
    .get(entryLinksPaths)
    .send();
  return response.body;
}
