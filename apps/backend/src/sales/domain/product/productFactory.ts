import { RandomService } from '../../../infrastructure/random/random.service';
import { Product } from './product';
import { CreateProduct } from './commands/createProduct';
import { TimeService } from '../../../infrastructure/time/time.service';

interface ProductFactoryDeps {
  random: RandomService;
  time: TimeService;
}

export class ProductFactory {
  constructor(private readonly deps: ProductFactoryDeps) {}

  create(command: CreateProduct): Product {
    const productId = this.deps.random.generateULID();
    const now = this.deps.time.now();

    return new Product({
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
