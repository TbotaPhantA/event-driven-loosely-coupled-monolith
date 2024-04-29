import { Link } from '../../../../src/sales/application/product/dto/output/links/link';
import { assertIsNotEmpty } from '../../../../src/infrastructure/shared/utils/assertIsNotEmpty';
import { UpdateProductInfo } from '../../../../src/sales/domain/product/commands/updateProductInfo';

export const findUpdateProductInfoPath = (links: Link[]): string => {
  const updateProductInfo = links.find(link => link.name === UpdateProductInfo.name)?.path;
  assertIsNotEmpty(updateProductInfo);
  return updateProductInfo
}
