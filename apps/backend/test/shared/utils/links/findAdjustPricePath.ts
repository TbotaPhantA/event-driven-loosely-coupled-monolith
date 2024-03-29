import { AdjustPrice } from '../../../../src/sales/domain/product/commands/adjustPrice';
import { assertIsNotEmpty } from '../../../../src/infrastructure/shared/utils/assertIsNotEmpty';
import { Link } from '../../../../src/sales/application/product/dto/output/links/link';

export function findAdjustPricePath(links: Link[]): string {
  const adjustPricePath = links.find(link => link.name === AdjustPrice.name)?.path;
  assertIsNotEmpty(adjustPricePath);
  return adjustPricePath
}
