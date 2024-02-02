import { InjectionBuilder } from 'ts-fixture-builder';
import { PriceAdjusted } from '../../../../../src/sales/domain/product/events/priceAdjusted';

export class PriceAdjustedBuilder {
  static get defaultAll(): InjectionBuilder<PriceAdjusted> {
    return new InjectionBuilder<PriceAdjusted>(new PriceAdjusted({
      after: {
        productId: 'productId',
        newPrice: 1000,
        updatedAt: new Date(2022, 0, 3),
      },
    }));
  }
}
