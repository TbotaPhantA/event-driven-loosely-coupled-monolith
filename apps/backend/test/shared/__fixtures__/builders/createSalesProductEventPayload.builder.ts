import { InjectionBuilder } from 'ts-fixture-builder';
import {
  CreateSalesProductEventPayload
} from '../../../../src/storage/acl/dto/input/createSalesProductEventPayload.dto';
import { CreateSalesProductEventPayloadChangesBuilder } from './createSalesProductEventPayloadChanges.builder';

export class CreateSalesProductEventPayloadBuilder {
  static get defaultAll(): InjectionBuilder<CreateSalesProductEventPayload> {
    return new InjectionBuilder<CreateSalesProductEventPayload>(new CreateSalesProductEventPayload()).with({
      productId: 'productId',
      changes: CreateSalesProductEventPayloadChangesBuilder.defaultAll.result,
    });
  }
}
