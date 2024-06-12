import {
  CreateSalesProductEventPayloadChanges
} from '../../../../src/storage/acl/dto/input/createSalesProductEventPayloadChanges.dto';
import { InjectionBuilder } from 'ts-fixture-builder';

export class CreateSalesProductEventPayloadChangesBuilder {
  static get defaultAll(): InjectionBuilder<CreateSalesProductEventPayloadChanges> {
    return new InjectionBuilder<CreateSalesProductEventPayloadChanges>(
      new CreateSalesProductEventPayloadChanges(),
    ).with({
      productId: 'productId',
      name: 'name',
      description: 'description',
      price: 500,
      createdAt: new Date(2022, 0, 3),
      updatedAt: new Date(2022, 0, 3),
      removedAt: null,
    })
  }
}
