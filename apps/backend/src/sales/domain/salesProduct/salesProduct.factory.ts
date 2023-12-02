import { RandomService } from '../../../infrastructure/random/random.service';
import { SalesProduct } from './salesProduct';
import { CreateSalesProduct } from './commands/createSalesProduct';
import { TimeService } from '../../../infrastructure/time/time.service';

interface SalesProductFactoryDeps {
  random: RandomService;
  time: TimeService;
}

export class SalesProductFactory {
  constructor(private readonly deps: SalesProductFactoryDeps) {}

  create(command: CreateSalesProduct): SalesProduct {
    const productId = this.deps.random.generateULID();
    const now = this.deps.time.now();

    return new SalesProduct({
      productId,
      name: command.name,
      description: command.description,
      price: command.price,
      createdAt: now,
      updatedAt: now,
      removedAt: null,
    });
  }
}
