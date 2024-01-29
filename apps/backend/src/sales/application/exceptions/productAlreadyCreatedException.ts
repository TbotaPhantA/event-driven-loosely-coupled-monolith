import { ConflictException } from '@nestjs/common';
import { PRODUCT_ALREADY_CREATED } from '../../../infrastructure/shared/errorMessages';
import { ProductOutputDto } from '../dto/output/productOutputDto';

export class ProductAlreadyCreatedException extends ConflictException {
  public readonly product: ProductOutputDto;
  constructor(product: ProductOutputDto) {
    super(PRODUCT_ALREADY_CREATED);
    this.product = new ProductOutputDto(product);
  }
}
