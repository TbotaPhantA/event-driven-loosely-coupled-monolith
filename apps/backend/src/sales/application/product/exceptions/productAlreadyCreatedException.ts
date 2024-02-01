import { ConflictException } from '@nestjs/common';
import { PRODUCT_ALREADY_CREATED } from '../../../../infrastructure/shared/errorMessages';
import { CreateProductOutputDto } from '../dto/output/createProductOutputDto';
import { Link } from '../dto/output/links/link';
import { ProductOutputDto } from '../dto/output/productOutputDto';

export class ProductAlreadyCreatedException extends ConflictException {
  public readonly product: ProductOutputDto;
  public readonly links: Link[];

  constructor(product: CreateProductOutputDto) {
    super(PRODUCT_ALREADY_CREATED);
    this.product = product.product;
    this.links = product.links;
  }
}
