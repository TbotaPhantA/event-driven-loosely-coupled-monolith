import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../../src/app.module';
import { CreateSalesProductBuilder } from '../../../__fixtures__/builders/commands/createSalesProduct.builder';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

async function deleteSalesProduct(productId: string, dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.startTransaction();
    await queryRunner.query(
      `DELETE FROM sales_products WHERE product_id = '${productId}'`
    );
    await queryRunner.commitTransaction();
  } catch (error) {
    console.error('Error occurred during deletion:', error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

describe('SalesProduct', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )

    dataSource = app.get(DataSource);

    await app.init();
  })

  describe('POST /sales/product/create-sales-product', () => {
    const path = '/sales/product/create-sales-product'
    const successfulTestCases = [
      {
        toString: (): string => '1 when given valid body - should successfully respond',
        requestBody: CreateSalesProductBuilder.defaultAll.with({
          name: 'Xiaomi',
          price: 500,
          description: 'An android phone',
        }).result,
      },
    ];

    test.each(successfulTestCases)('%s', async ({ requestBody }) => {
      const { body, status } = await request(app.getHttpServer()).post(path).send(requestBody);
      const productId = body.productId;

      expect(status).toStrictEqual(HttpStatus.CREATED);
      expect({
        name: body.name,
        price: body.price,
        description: body.description,
      }).toStrictEqual({
        name: requestBody.name,
        price: requestBody.price,
        description: requestBody.description,
      });

      await deleteSalesProduct(productId, dataSource);
    });

    const unprocessableTestCases = [
      {
        toString: (): string => '1 when invalid body - should respond with validation error',
        requestBody: CreateSalesProductBuilder.defaultAll.with({
          // @ts-expect-error intentionally incorrect type
          name: true,
          price: 500,
          description: 'An android phone',
        }).result,
      },
    ]

    test.each(unprocessableTestCases)('%s', async ({ requestBody }) => {
      const { status } = await request(app.getHttpServer()).post(path).send(requestBody);
      expect(status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await moduleRef.close();
    await app.close();
  })
});
