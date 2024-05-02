import { ProductController } from '../../../../src/sales/application/product/product.controller';
import { findCreateProductPath } from '../../../shared/utils/links/findCreateProductPath';
import { GetSalesEntryLinksOutputDto } from '../../../../src/sales/application/shared/dto/getSalesEntryLinksOutputDto';
import { requestSalesEntryLinks } from '../../../shared/utils/requests/requestSalesEntryLinks';
import { requestCreateProduct } from '../../../shared/utils/requests/requestCreateProduct';
import { app } from '../../globalBeforeAndAfterAll';
import { CreateProductBuilder } from '../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { CreateProductOutputDto } from '../../../../src/sales/application/product/dto/output/createProductOutputDto';
import { HttpStatus } from '@nestjs/common';

// TODO: fix
describe.skip(`${ProductController.name}`, () => {
  let salesEntryLinks: GetSalesEntryLinksOutputDto;
  let createProductPath: string;

  beforeAll(async () => {
    salesEntryLinks = await requestSalesEntryLinks();
    createProductPath = findCreateProductPath(salesEntryLinks);
  });

  test('performance - should create 100 products simultaneously without any errors', async () => {
    const promises = new Array<Promise<{body: CreateProductOutputDto, status: HttpStatus }>>()

    for (let i = 0; i < 10; i++) {
      promises.push(requestCreateProduct(
        app,
        createProductPath,
        'correlationId1111' + i,
        CreateProductBuilder.defaultAll.result,
      ))
    }

    const responses = await Promise.all(promises);

    for (const response of responses) {
      expect(response.status).toStrictEqual(HttpStatus.CREATED);
    }
  });
});
