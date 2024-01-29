import {
  CreateProductBuilder,
} from '../../../../shared/__fixtures__/builders/commands/createProduct.builder';
import { TestBed } from '@automock/jest';
import { CreateProductService } from '../../../../../src/sales/application/services/createProduct.service';
import { ITransactionService } from '../../../../../src/infrastructure/transaction/ITransaction.service';
import {
  IProductRepository
} from '../../../../../src/sales/application/repositories/productRepository/IProductRepository';
import { ProductFactory } from '../../../../../src/sales/domain/product/productFactory';
import { ProductBuilder } from '../../../../shared/__fixtures__/builders/productBuilder';
import { TRANSACTION_SERVICE } from '../../../../../src/infrastructure/transaction/shared/constants';
import { SALES_CONTEXT_NAME, SALES_PRODUCT_REPOSITORY } from '../../../../../src/sales/application/shared/constants';
import { ITransaction } from '../../../../../src/infrastructure/transaction/shared/types/ITransaction';
import { IsolationLevelUnion } from '../../../../../src/infrastructure/transaction/isolationLevelUnion';
import {
  IProductMessagesService
} from '../../../../../src/sales/application/services/interfaces/IProductMessagesService';
import {
  ProductCreatedEventBuilder
} from '../../../../shared/__fixtures__/builders/events/productCreatedEvent.builder';
import {
  IProductIdempotencyService
} from '../../../../../src/sales/application/services/interfaces/IProductIdempotencyService';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../../../src/infrastructure/messages/constants';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from '../../../../../src/infrastructure/idempotency/constants';
import { ProductOutputDto } from '../../../../../src/sales/application/dto/output/productOutputDto';

describe('CreateSalesProductService', () => {
  let createSalesProductService: CreateProductService;
  let stubTransactionService: jest.Mocked<ITransactionService>;
  let stubSalesProductRepository: jest.Mocked<IProductRepository>;
  let stubSalesProductFactory: jest.Mocked<ProductFactory>;
  let stubIdempotencyService: jest.Mocked<IProductIdempotencyService>;
  let stubSalesProductMessageService: jest.Mocked<IProductMessagesService>;
  const transaction = {}

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CreateProductService).compile()

    createSalesProductService = unit;
    stubTransactionService = unitRef.get(TRANSACTION_SERVICE);
    stubSalesProductRepository = unitRef.get(SALES_PRODUCT_REPOSITORY)
    stubSalesProductMessageService = unitRef.get(SALES_PRODUCT_MESSAGES_SERVICE);
    stubSalesProductFactory = unitRef.get(ProductFactory);
    stubIdempotencyService = unitRef.get(SALES_PRODUCT_IDEMPOTENCY_SERVICE);

    stubTransactionService.withTransaction = jest.fn().mockImplementation(<T>(
      level: IsolationLevelUnion,
      fn: (transaction: ITransaction) => Promise<T>
    ) => {
      fn(transaction);
    })
    const salesProduct = ProductBuilder.defaultAll.result;
    stubSalesProductFactory.create = jest.fn().mockReturnValue(salesProduct);
    stubSalesProductRepository.save = jest.fn().mockResolvedValue(salesProduct);
  })

  describe('runTransaction', () => {
    test('idempotent request assert - should be called', async () => {
      const command = CreateProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubIdempotencyService.assertRequestIsIdempotent).toHaveBeenCalledWith(transaction);
    });

    test('idempotent request insert - should be called', async () => {
      const product = ProductBuilder.defaultAll.result;
      stubSalesProductFactory.create = jest.fn().mockReturnValue(product);
      const outputDto = new ProductOutputDto(product.export());
      const command = CreateProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubIdempotencyService.insertRequest).toHaveBeenCalledWith(outputDto, transaction);
    });

    test('event insert - should be called', async () => {
      const product = ProductBuilder.defaultAll.result;
      stubSalesProductFactory.create = jest.fn().mockReturnValue(product);
      const command = CreateProductBuilder.defaultAll.result;
      const event = ProductCreatedEventBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubSalesProductMessageService.insertEvent).toHaveBeenCalledWith(event, SALES_CONTEXT_NAME, transaction);
    })

    describe('save SalesProduct', () => {
      const saveSalesProductTestCases = [
        {
          toString: (): string => '1 should be called',
          givenSalesProduct: ProductBuilder.defaultAll.result,
          command: CreateProductBuilder.defaultAll.result,
        },
        {
          toString: (): string => '2 should be called',
          givenSalesProduct: ProductBuilder.defaultAll.with({
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

      test.each(saveSalesProductTestCases)('%s', async ({ givenSalesProduct, command }) => {
        stubSalesProductFactory.create = jest.fn().mockReturnValue(givenSalesProduct);
        await createSalesProductService.runTransaction(command);
        expect(stubSalesProductRepository.save).toHaveBeenCalledWith(givenSalesProduct, transaction);
      });
    });
  });
});
