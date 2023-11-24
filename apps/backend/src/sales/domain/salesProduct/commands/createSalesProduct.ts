export class CreateSalesProduct {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly price: number,
  ) {}
}
