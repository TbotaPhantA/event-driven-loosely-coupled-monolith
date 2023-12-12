import { InjectionBuilder } from 'ts-fixture-builder';
import { AdjustPrice } from '../../../../../../../src/sales/domain/salesProduct/commands/adjustPrice';

export class AdjustPriceBuilder {
  static get defaultAll(): InjectionBuilder<AdjustPrice> {
    return new InjectionBuilder<AdjustPrice>(
      AdjustPrice.createByRaw({
        productId: '01HG1MMNZRYYPFBKZDNQ4P08HB',
        newPrice: 100,
      }),
    );
  }
}
