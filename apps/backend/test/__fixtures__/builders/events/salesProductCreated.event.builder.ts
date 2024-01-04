import { InjectionBuilder } from 'ts-fixture-builder';
import { SalesProductCreated } from '../../../../src/sales/domain/salesProduct/events/salesProductCreated';
import { SalesProductBuilder } from '../salesProduct.builder';

export class SalesProductCreatedEventBuilder {
  static get defaultAll(): InjectionBuilder<SalesProductCreated> {
    return new InjectionBuilder<SalesProductCreated>(
      new SalesProductCreated(SalesProductBuilder.defaultAll.result),
    );
  }
}
