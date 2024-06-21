import { ProductController } from '../../../../src/sales/application/product/product.controller';
import { CreateProductBuilder } from '../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { cleaner, requester } from '../../globalBeforeAndAfterAll';
import { HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';
import { PRODUCT_ALREADY_CREATED } from '../../../../src/infrastructure/shared/errorMessages';
import { ProductOutputDto } from '../../../../src/sales/application/product/dto/output/productOutputDto';

/**
 * TODO:
 * - create idempotency test
 * - create broker test
 * - create 4** tests
 * - think of parallelization
 */
describe(`${ProductController.name}`, () => {
  let correlationId: string;
  let product: ProductOutputDto | undefined;

  beforeAll(() => {
    correlationId = ulid();
  })

  afterAll(async () => {
    if (product) {
      await cleaner.cleanupProductDataInDB(product.productId);
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

      product = body.product;
    })

    test('idempotent request with same correlationId - should respond that product is already created', async () => {
      const dto = CreateProductBuilder.defaultAll.result;
      const secondResponse = await requester.createProduct({ dto, correlationId });

      expect(secondResponse.status).toStrictEqual(HttpStatus.CONFLICT)
      expect(secondResponse.body).toMatchObject({
        message: PRODUCT_ALREADY_CREATED,
        product,
      })
    })
  })
});
