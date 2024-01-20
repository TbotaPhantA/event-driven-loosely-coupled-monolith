import { ConflictException } from '@nestjs/common';
import { PRODUCT_ALREADY_CREATED } from '../../../infrastructure/shared/errorMessages';
import { SalesProductOutputDto } from '../dto/output/salesProductOutputDto';

export class ProductAlreadyCreatedException extends ConflictException {
  public readonly salesProduct: SalesProductOutputDto;
  constructor(salesProduct: SalesProductOutputDto) {
    super(PRODUCT_ALREADY_CREATED);
    this.salesProduct = new SalesProductOutputDto(salesProduct);
  }
}
