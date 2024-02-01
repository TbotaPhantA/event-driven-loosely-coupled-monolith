import { GetSalesEntryLinksOutputDto } from '../../../../src/sales/application/shared/dto/getSalesEntryLinksOutputDto';
import { CreateProduct } from '../../../../src/sales/domain/product/commands/createProduct';
import { assertIsNotEmpty } from '../../../../src/infrastructure/shared/utils/assertIsNotEmpty';

export function findCreateProductPath(entryLinks: GetSalesEntryLinksOutputDto): string {
  const createProductPath = entryLinks.links
    .find(link => link.name = CreateProduct.name)?.path;
  assertIsNotEmpty(createProductPath);
  return createProductPath;
}
