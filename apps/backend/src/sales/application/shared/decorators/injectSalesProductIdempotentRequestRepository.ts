import { Inject } from '@nestjs/common';
import { SALES_PRODUCT_IDEMPOTENT_REQUEST_REPOSITORY } from '../constants';

export const InjectSalesProductIdempotentRequestRepository = (): ReturnType<typeof Inject> =>
  Inject(SALES_PRODUCT_IDEMPOTENT_REQUEST_REPOSITORY)
