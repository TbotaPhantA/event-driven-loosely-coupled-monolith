import { RandomService } from '../../../infrastructure/random/random.service';
import { SalesProduct } from './salesProduct';
import { CreateSalesProduct } from './commands/createSalesProduct';

interface SalesProductFactoryDeps {
  random: RandomService;
}

export class SalesProductFactory {
  constructor(private readonly deps: SalesProductFactoryDeps) {}

  create(command: CreateSalesProduct): SalesProduct {
    const productId = this.deps.random.generateULID();

    return new SalesProduct({
      productId,
      name: command.name,
      description: command.description,
      price: command.price,
    });
  }
}
