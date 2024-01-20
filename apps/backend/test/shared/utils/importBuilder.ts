import { Importable } from '../../../src/infrastructure/shared/types/importable';

export class ImportBuilder<T extends Importable> {
  private readonly __data: any;
  constructor(
    private readonly __result: T,
  ) {
    this.__data = {};
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
