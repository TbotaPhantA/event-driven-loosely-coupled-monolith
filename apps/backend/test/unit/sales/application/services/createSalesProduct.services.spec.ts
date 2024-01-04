import { CreateSalesProductBuilder } from '../../../../__fixtures__/builders/commands/createSalesProduct.builder';
import { TestBed } from '@automock/jest';
import { CreateSalesProductService } from '../../../../../src/sales/application/services/createSalesProduct.service';
import { ITransactionService } from '../../../../../src/infrastructure/transaction/ITransaction.service';
import {
  ISalesProductRepository
} from '../../../../../src/sales/application/repositories/salesProductRepository/ISalesProduct.repository';
import { SalesProductFactory } from '../../../../../src/sales/domain/salesProduct/salesProduct.factory';
import { SalesProductBuilder } from '../../../../__fixtures__/builders/salesProduct.builder';
import { TRANSACTION_SERVICE } from '../../../../../src/infrastructure/transaction/shared/constants';
import { SALES_CONTEXT_NAME, SALES_PRODUCT_REPOSITORY } from '../../../../../src/sales/application/shared/constants';
import { ITransaction } from '../../../../../src/infrastructure/transaction/shared/types/ITransaction';
import { IsolationLevelUnion } from '../../../../../src/infrastructure/transaction/isolationLevelUnion';
import {
  ISalesProductMessagesService
} from '../../../../../src/sales/application/services/interfaces/ISalesProductMessagesService';
import {
  SalesProductCreatedEventBuilder
} from '../../../../__fixtures__/builders/events/salesProductCreated.event.builder';
import {
  ISalesProductIdempotencyService
} from '../../../../../src/sales/application/services/interfaces/ISalesProductIdempotency.service';
import { SALES_PRODUCT_MESSAGES_SERVICE } from '../../../../../src/infrastructure/messages/constants';
import { SALES_PRODUCT_IDEMPOTENCY_SERVICE } from '../../../../../src/infrastructure/idempotency/constants';

describe('CreateSalesProductService', () => {
  let createSalesProductService: CreateSalesProductService;
  let stubTransactionService: jest.Mocked<ITransactionService>;
  let stubSalesProductRepository: jest.Mocked<ISalesProductRepository>;
  let stubSalesProductFactory: jest.Mocked<SalesProductFactory>;
  let stubIdempotencyService: jest.Mocked<ISalesProductIdempotencyService>;
  let stubSalesProductMessageService: jest.Mocked<ISalesProductMessagesService>;
  const transaction = {}

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CreateSalesProductService).compile()

    createSalesProductService = unit;
    stubTransactionService = unitRef.get(TRANSACTION_SERVICE);
    stubSalesProductRepository = unitRef.get(SALES_PRODUCT_REPOSITORY)
    stubSalesProductMessageService = unitRef.get(SALES_PRODUCT_MESSAGES_SERVICE);
    stubSalesProductFactory = unitRef.get(SalesProductFactory);
    stubIdempotencyService = unitRef.get(SALES_PRODUCT_IDEMPOTENCY_SERVICE);

    stubTransactionService.withTransaction = jest.fn().mockImplementation(<T>(
      level: IsolationLevelUnion,
      fn: (transaction: ITransaction) => Promise<T>
    ) => {
      fn(transaction);
    })
    const salesProduct = SalesProductBuilder.defaultAll.result;
    stubSalesProductFactory.create = jest.fn().mockReturnValue(salesProduct);
    stubSalesProductRepository.save = jest.fn().mockResolvedValue(salesProduct);
  })

  describe('runTransaction', () => {
    test('idempotent request assert - should be called', async () => {
      const command = CreateSalesProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubIdempotencyService.assertCreateSalesProductIdempotent).toHaveBeenCalledWith(transaction);
    });

    test('idempotent request insert - should be called', async () => {
      const product = SalesProductBuilder.defaultAll.result;
      stubSalesProductFactory.create = jest.fn().mockReturnValue(product);
      const command = CreateSalesProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubIdempotencyService.insert).toHaveBeenCalledWith(product, transaction);
    });

    test('event insert - should be called', async () => {
      const product = SalesProductBuilder.defaultAll.result;
      stubSalesProductFactory.create = jest.fn().mockReturnValue(product);
      const command = CreateSalesProductBuilder.defaultAll.result;
      const event = SalesProductCreatedEventBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(stubSalesProductMessageService.insertEvent).toHaveBeenCalledWith(event, SALES_CONTEXT_NAME, transaction);
    })

    describe('save SalesProduct', () => {
      const saveSalesProductTestCases = [
        {
          toString: (): string => '1 should be called',
          givenSalesProduct: SalesProductBuilder.defaultAll.result,
          command: CreateSalesProductBuilder.defaultAll.result,
        },
        {
          toString: (): string => '2 should be called',
          givenSalesProduct: SalesProductBuilder.defaultAll.with({
            productId: '01HGNJHGSPJS3QM3ZGMY181ZX6',
            name: 'Phone2',
            price: 102,
            description: 'An android phone2',
            createdAt: new Date(2022, 0, 4),
            updatedAt: new Date(2022, 0, 4),
            removedAt: null,
          }).result,
          command: CreateSalesProductBuilder.defaultAll.with({
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
