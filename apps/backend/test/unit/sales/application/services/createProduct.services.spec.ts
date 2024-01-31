import {
  CreateProductBuilder,
} from '../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { TestBed } from '@automock/jest';
import { CreateProductService } from '../../../../../src/sales/application/services/createProduct.service';
import { ITransactionService } from '../../../../../src/infrastructure/transaction/ITransaction.service';
import {
  IProductRepository
} from '../../../../../src/sales/application/repositories/productRepository/IProduct.repository';
import { ProductFactory } from '../../../../../src/sales/domain/product/productFactory';
import { ProductBuilder } from '../../../../shared/__fixtures__/builders/productBuilder';
import { TRANSACTION_SERVICE } from '../../../../../src/infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../../../../../src/sales/application/shared/constants';
import { ITransaction } from '../../../../../src/infrastructure/transaction/shared/types/ITransaction';
import { IsolationLevelUnion } from '../../../../../src/infrastructure/transaction/isolationLevelUnion';
import {
  IProductMessagesService
} from '../../../../../src/sales/application/services/interfaces/IProductMessages.service';
import {
  IProductIdempotencyService
} from '../../../../../src/sales/application/services/interfaces/IProductIdempotency.service';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../../../src/infrastructure/messages/constants';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from '../../../../../src/infrastructure/idempotency/constants';
import { Product } from '../../../../../src/sales/domain/product/product';
import { mock } from 'jest-mock-extended';
import { TimeService } from '../../../../../src/infrastructure/time/time.service';
import { RandomService } from '../../../../../src/infrastructure/random/random.service';
import { ProductCreated } from '../../../../../src/sales/domain/product/events/productCreated';
import { _MockProxy } from 'jest-mock-extended/lib/Mock';
import { CreateProductOutputDto } from '../../../../../src/sales/application/dto/output/createProductOutputDto';

describe(CreateProductService.name, () => {
  let createProductService: CreateProductService;
  let stubTransactionService: jest.Mocked<ITransactionService>;
  let stubProductRepository: jest.Mocked<IProductRepository>;
  let stubProductFactory: jest.Mocked<ProductFactory>;
  let stubIdempotencyService: jest.Mocked<IProductIdempotencyService>;
  let stubProductMessageService: jest.Mocked<IProductMessagesService>;
  const transaction = {}

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CreateProductService).compile()

    createProductService = unit;
    stubTransactionService = unitRef.get(TRANSACTION_SERVICE);
    stubProductRepository = unitRef.get(SALES_PRODUCT_REPOSITORY)
    stubProductMessageService = unitRef.get(SALES_PRODUCT_MESSAGES_SERVICE);
    stubProductFactory = unitRef.get(ProductFactory);
    stubIdempotencyService = unitRef.get(SALES_PRODUCT_IDEMPOTENCY_SERVICE);

    stubTransactionService.withTransaction = jest.fn().mockImplementation(<T>(
      level: IsolationLevelUnion,
      fn: (transaction: ITransaction) => Promise<T>
    ) => {
      fn(transaction);
    })
    const product = ProductBuilder.defaultAll.result;
    stubProductFactory.create = jest.fn().mockReturnValue(product);
    stubProductRepository.save = jest.fn().mockResolvedValue(product);
  })

  describe(CreateProductService.prototype.runTransaction.name, () => {
    test('idempotent request assert - should be called', async () => {
      const command = CreateProductBuilder.defaultAll.result;

      await createProductService.runTransaction(command);

      expect(stubIdempotencyService.assertCreateProductRequestIsIdempotent).toHaveBeenCalledWith(transaction);
    });

    test('idempotent request insert - should be called', async () => {
      const product = ProductBuilder.defaultAll.result;
      stubProductFactory.create = jest.fn().mockReturnValue(product);
      const outputDto = CreateProductOutputDto.from(product);
      const command = CreateProductBuilder.defaultAll.result;

      await createProductService.runTransaction(command);

      expect(stubIdempotencyService.insertRequest).toHaveBeenCalledWith(outputDto, transaction);
    });

    test('event insert - should be called', async () => {
      const command = CreateProductBuilder.defaultAll.result;
      const product = Product.create(command, { time: getStubTime(), random: getStubRandom() });
      stubProductFactory.create = jest.fn().mockReturnValue(product);
      const events = [new ProductCreated({ data: { product: product.export() }})];

      await createProductService.runTransaction(command);

      expect(stubProductMessageService.insertEvents).toHaveBeenCalledWith(events, transaction);

      function getStubTime(): _MockProxy<TimeService> {
        const stubTime = mock<TimeService>();
        stubTime.now.mockReturnValue(new Date(2022, 0, 3));
        return stubTime;
      }

      function getStubRandom(): _MockProxy<RandomService> {
        const stubRandom = mock<RandomService>();
        stubRandom.generateULID.mockReturnValue('01HNGH0MYN74N7T47GBZD158V5');
        return stubRandom;
      }
    })

    describe('save product', () => {
      const saveProductTestCases = [
        {
          toString: (): string => '1 should be called',
          givenProduct: ProductBuilder.defaultAll.result,
          command: CreateProductBuilder.defaultAll.result,
        },
        {
          toString: (): string => '2 should be called',
          givenProduct: ProductBuilder.defaultAll.with({
            productId: '01HGNJHGSPJS3QM3ZGMY181ZX6',
            name: 'Phone2',
            price: 102,
            description: 'An android phone2',
            createdAt: new Date(2022, 0, 4),
            updatedAt: new Date(2022, 0, 4),
            removedAt: null,
          }).result,
          command: CreateProductBuilder.defaultAll.with({
            name: 'Phone2',
            price: 102,
            description: 'An android phone2',
          }).result,
        },
      ];

      test.each(saveProductTestCases)('%s', async ({ givenProduct, command }) => {
        stubProductFactory.create = jest.fn().mockReturnValue(givenProduct);
        await createProductService.runTransaction(command);
        expect(stubProductRepository.save).toHaveBeenCalledWith(givenProduct, transaction);
      });
    });
  });
});
