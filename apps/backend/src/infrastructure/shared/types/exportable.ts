export interface Exportable<T extends Record<string, any> = Record<string, any>> {
  export(): T
}
