import {
  adjustPriceResource,
  createProductResource,
  salesProductResource
} from '../../../src/sales/application/shared/resources';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAllSalesPaths() {
  return {
    createProductPath: `/${salesProductResource}/${createProductResource}`,
    adjustPricePath: `/${salesProductResource}/${adjustPriceResource}`,
  }
}
