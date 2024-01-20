export interface Importable<T extends Record<string, any> = Record<string, any>> {
  import(data: T): void;
}
