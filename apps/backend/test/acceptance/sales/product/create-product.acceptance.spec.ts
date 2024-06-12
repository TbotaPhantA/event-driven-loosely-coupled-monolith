import { ProductController } from '../../../../src/sales/application/product/product.controller';
import { CreateProductBuilder } from '../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { cleaner, requester } from '../../globalBeforeAndAfterAll';
import { HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';

describe(`${ProductController.name}`, () => {
  let correlationId: string;
  let productId: string | undefined;

  beforeAll(() => {
    correlationId = ulid();
  })

  afterAll(async () => {
    if (productId) {
      await cleaner.cleanupProductDataInDB(productId);
    }
  })

  describe(`${ProductController.prototype.createProduct.name}`, () => {
    test(`should return proper response` , async () => {
      const dto = CreateProductBuilder.defaultAll.result;

      const { body, status } = await requester.createProduct({ dto, correlationId });

      expect(status).toStrictEqual(HttpStatus.CREATED);
      expect(body.product.productId).toBeTruthy();
      expect(body.product.createdAt).toBeTruthy();
      expect(body.product.updatedAt).toBeTruthy();
      expect(body.product.removedAt).toStrictEqual(null);
      expect(body.product).toMatchObject({
        name: dto.name,
        price: dto.price,
        description: dto.description,
      });

      productId = body.product.productId;
    })
  })
});
