import { ConflictException } from '@nestjs/common';
import { PRODUCT_ALREADY_CREATED } from '../../../infrastructure/shared/errorMessages';
import { SalesProduct } from '../../domain/salesProduct/salesProduct';
import { SalesProductOutputDto } from '../dto/output/salesProductOutputDto';
import { SalesProductEntity } from '../entities/salesProduct.entity';

export class ProductAlreadyCreatedException extends ConflictException {
  public readonly salesProduct: SalesProductOutputDto;
  constructor(salesProduct: SalesProduct | SalesProductEntity) {
    super(PRODUCT_ALREADY_CREATED);
    this.salesProduct = new SalesProductOutputDto(salesProduct);
  }
}
