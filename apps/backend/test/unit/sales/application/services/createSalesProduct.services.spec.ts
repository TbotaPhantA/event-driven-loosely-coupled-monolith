import { CreateSalesProductBuilder } from '../../../../__fixtures__/builders/commands/createSalesProduct.builder';
import { TestBed } from '@automock/jest';
import { CreateSalesProductService } from '../../../../../src/sales/application/services/createSalesProduct.service';
import { ITransactionService } from '../../../../../src/infrastructure/transaction/ITransaction.service';
import {
  ISalesProductRepository
} from '../../../../../src/sales/application/repositories/salesProductRepository/ISalesProduct.repository';
import { SalesProductFactory } from '../../../../../src/sales/domain/salesProduct/salesProduct.factory';
import {
  SalesProductRequestIdempotencyService
} from '../../../../../src/sales/application/services/salesProductRequestIdempotency.service';
import { SalesProductBuilder } from '../../../../__fixtures__/builders/salesProduct.builder';
import { TRANSACTION_SERVICE } from '../../../../../src/infrastructure/transaction/shared/constants';
import { SALES_PRODUCT_REPOSITORY } from '../../../../../src/sales/application/shared/constants';
import { ITransaction } from '../../../../../src/infrastructure/transaction/shared/types/ITransaction';
import { IsolationLevelUnion } from '../../../../../src/infrastructure/transaction/isolationLevelUnion';

describe('CreateSalesProductService', () => {
  let createSalesProductService: CreateSalesProductService;
  let transactionService: jest.Mocked<ITransactionService>;
  let salesProductRepository: jest.Mocked<ISalesProductRepository>;
  let salesProductFactory: jest.Mocked<SalesProductFactory>;
  let idempotentRequestService: jest.Mocked<SalesProductRequestIdempotencyService>;
  const transaction = {}

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CreateSalesProductService).compile()

    createSalesProductService = unit;
    transactionService = unitRef.get(TRANSACTION_SERVICE);
    salesProductRepository = unitRef.get(SALES_PRODUCT_REPOSITORY)
    salesProductFactory = unitRef.get(SalesProductFactory);
    idempotentRequestService = unitRef.get(SalesProductRequestIdempotencyService);


    transactionService.withTransaction = jest.fn().mockImplementation(<T>(
      level: IsolationLevelUnion,
      fn: (transaction: ITransaction) => Promise<T>
    ) => {
      fn(transaction);
    })
    const salesProduct = SalesProductBuilder.defaultAll.result;
    salesProductFactory.create = jest.fn().mockReturnValue(salesProduct);
    salesProductRepository.save = jest.fn().mockResolvedValue(salesProduct);
  })

  describe('runTransaction', () => {
    test('idempotent request assert - should be called', async () => {
      const command = CreateSalesProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(idempotentRequestService.assertCreateSalesProductIdempotent).toHaveBeenCalledWith(transaction);
    });

    test('idempotent request insert - should be called', async () => {
      const product = SalesProductBuilder.defaultAll.result;
      salesProductFactory.create = jest.fn().mockReturnValue(product);
      const command = CreateSalesProductBuilder.defaultAll.result;

      await createSalesProductService.runTransaction(command);

      expect(idempotentRequestService.insert).toHaveBeenCalledWith(product, transaction);
    });

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
        salesProductFactory.create = jest.fn().mockReturnValue(givenSalesProduct);
        await createSalesProductService.runTransaction(command);
        expect(salesProductRepository.save).toHaveBeenCalledWith(givenSalesProduct, transaction);
      });
    });
  });
});
