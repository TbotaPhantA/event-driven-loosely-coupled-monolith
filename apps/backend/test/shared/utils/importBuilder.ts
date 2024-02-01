import { Importable } from '../../../src/infrastructure/shared/types/importable';
import { Exportable } from '../../../src/infrastructure/shared/types/exportable';

export class ImportBuilder<T extends Importable & Exportable> {
  private readonly __data: any;
  constructor(
    private readonly __result: T,
  ) {
    this.__data = __result.export();
  }

  get result(): T {
    this.__result.import(this.__data);
    return this.__result;
  }

  with(fields: Partial<Parameters<T['import']>[0]>): ImportBuilder<T> {
    Object.assign(this.__data, fields);
    return this;
  }
}
