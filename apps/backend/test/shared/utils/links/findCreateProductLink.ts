import { GetEntryLinksOutputDto } from '../../../../src/sales/application/dto/output/getEntryLinksOutput.dto';
import { CreateSalesProduct } from '../../../../src/sales/domain/salesProduct/commands/createSalesProduct';
import { assertIsNotEmpty } from '../../../../src/infrastructure/shared/utils/assertIsNotEmpty';

export function findCreateProductLink(entryLinks: GetEntryLinksOutputDto): string {
  const createSalesProductPath = entryLinks.links
    .find(link => link.name = CreateSalesProduct.name)?.path;
  assertIsNotEmpty(createSalesProductPath);
  return createSalesProductPath;
}
