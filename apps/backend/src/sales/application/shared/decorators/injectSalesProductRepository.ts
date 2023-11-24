import { Inject } from '@nestjs/common';
import { SALES_PRODUCT_REPOSITORY } from '../constants';

export const InjectSalesProductRepository = (): ReturnType<typeof Inject> =>
  Inject(SALES_PRODUCT_REPOSITORY);
