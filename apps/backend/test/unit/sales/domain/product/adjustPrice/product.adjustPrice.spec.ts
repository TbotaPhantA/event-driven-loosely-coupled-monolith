import { ProductBuilder } from '../../../../../shared/__fixtures__/builders/productBuilder';
import { TimeService } from '../../../../../../src/infrastructure/time/time.service';
import { mock } from 'jest-mock-extended';
import { AdjustPriceBuilder } from '../../../../../shared/__fixtures__/builders/commands/adjustPrice.builder';

describe('Product', () => {
  const now = new Date(2022, 0, 4);
  const mockTimeService = mock<TimeService>();

  beforeEach(() => {
    mockTimeService.now.mockReturnValue(now);
  })

  describe('adjustPrice', () => {
    const testCases = [
      {
        toString: (): string => '1 - price should be properly changed',
        product: ProductBuilder.defaultAll.with({
          price: 500,
          updatedAt: new Date(2022, 0, 3),
        }).result,
        command: AdjustPriceBuilder.defaultAll.with({
          newPrice: 1000,
        }).result,
        expectedProduct: ProductBuilder.defaultAll.with({
          price: 1000,
          updatedAt: now,
        }).result
      },
    ];

    test.each(testCases)('%s', ({ product, command, expectedProduct }) => {
      product.adjustPrice(command, { time: mockTimeService });

      expect(product.export()).toStrictEqual(expectedProduct.export());
    });
  });
});
