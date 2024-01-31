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
    return Product.create(command, this.deps);
  }
}
