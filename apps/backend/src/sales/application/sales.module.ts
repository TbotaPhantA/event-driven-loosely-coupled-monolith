import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { CreateProductService } from './product/services/createProduct.service';
import { ProductFactory } from '../domain/product/productFactory';
import { RandomService } from '../../infrastructure/random/random.service';
import { RandomModule } from '../../infrastructure/random/random.module';
import { TransactionModule } from '../../infrastructure/transaction/transaction.module';
import { SALES_PRODUCT_REPOSITORY } from './shared/constants';
import {
  DatabaseProductRepository,
} from '../dal/product/repositories/productRepository/databaseProductRepository.service';
import { AdjustPriceService } from './product/services/adjustPrice.service';
import { GetProductByIdQuery } from './product/queries/getProductById.query';
import { UpdateProductInfoService } from './product/services/updateProductInfo.service';
import { TimeModule } from '../../infrastructure/time/time.module';
import { TimeService } from '../../infrastructure/time/time.service';
import { DeleteProductService } from './product/services/deleteProduct.service';
import { IdempotencyModule } from '../../infrastructure/idempotency/idempotency.module';
import { MessagesModule } from '../../infrastructure/messages/messages.module';
import { SalesController } from './sales.controller';

@Module({
  imports: [RandomModule, TransactionModule, TimeModule, IdempotencyModule, MessagesModule],
  controllers: [ProductController, SalesController],
  providers: [
    GetProductByIdQuery,
    CreateProductService,
    AdjustPriceService,
    UpdateProductInfoService,
    DeleteProductService,
    {
      provide: ProductFactory,
      useFactory: (random: RandomService, time: TimeService): ProductFactory =>
        new ProductFactory({ random, time }),
      inject: [RandomService, TimeService],
    },
    {
      provide: SALES_PRODUCT_REPOSITORY,
      useClass: DatabaseProductRepository,
    },
  ],
})
export class SalesModule {}
