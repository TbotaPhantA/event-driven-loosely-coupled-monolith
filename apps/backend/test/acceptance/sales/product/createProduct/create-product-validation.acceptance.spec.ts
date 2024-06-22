import { ProductController } from '../../../../../src/sales/application/product/product.controller';
import { Requester } from '../../../../shared/utils/requests/requester';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../../src/app.module';
import { CreateProductBuilder } from '../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { HttpStatus } from '@nestjs/common';
import { SETUP_TIMEOUT } from '../../../../shared/constants';

describe(`${ProductController.name} validation`, () => {
  let requester: Requester;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      imports: [AppModule],
    }).compile();
    const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    requester = new Requester(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  }, SETUP_TIMEOUT)

  describe(`${ProductController.prototype.createProduct.name} validation`, () => {
    const testCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        dto: CreateProductBuilder.defaultAll.with({
          // @ts-expect-error INTENTIONALLY INCORRECT TYPE
          name: true,
        }).result,
      },
      {
        toString: (): string => '2 when invalid body - should respond with validation error',
        dto: CreateProductBuilder.defaultAll.with({
          // @ts-expect-error INTENTIONALLY INCORRECT TYPE
          price: 'laksdf00909',
        }).result,
      },
      {
        toString: (): string => '3 when invalid body - should respond with validation error',
        dto: CreateProductBuilder.defaultAll.with({
          // @ts-expect-error INTENTIONALLY INCORRECT TYPE
          description: false,
        }).result,
      },
    ]

    test.each(testCases)('%s', async ({ dto }) => {
      const { status } = await requester.createProduct({ dto });
      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  })
});
