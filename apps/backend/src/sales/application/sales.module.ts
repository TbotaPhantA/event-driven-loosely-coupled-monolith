import { Module } from '@nestjs/common';
import { SalesProductController } from './sales.controller';
import { CreateSalesProductService } from './services/createSalesProduct.service';
import { SalesProductFactory } from '../domain/salesProduct/salesProduct.factory';
import { RandomService } from '../../infrastructure/random/random.service';
import { RandomModule } from '../../infrastructure/random/random.module';
import { TransactionModule } from '../../infrastructure/transaction/transaction.module';
import { SALES_PRODUCT_REPOSITORY } from './shared/constants';
import { DatabaseSalesProductRepository } from './repositories/databaseSalesProdcutRepository.service';
import { AdjustPriceService } from './services/adjustPrice.service';
import { GetSalesProductByIdQuery } from './queries/getSalesProductByIdQuery';
import { UpdateProductInfoService } from './services/updateProductInfo.service';
import { TimeModule } from '../../infrastructure/time/time.module';
import { TimeService } from '../../infrastructure/time/time.service';
import { DeleteSalesProductService } from './services/deleteSalesProduct.service';

@Module({
  imports: [RandomModule, TransactionModule, TimeModule],
  controllers: [SalesProductController],
  providers: [
    GetSalesProductByIdQuery,
    CreateSalesProductService,
    AdjustPriceService,
    UpdateProductInfoService,
    DeleteSalesProductService,
    {
      provide: SalesProductFactory,
      useFactory: (random: RandomService, time: TimeService): SalesProductFactory =>
        new SalesProductFactory({ random, time }),
      inject: [RandomService, TimeService],
    },
    {
      provide: SALES_PRODUCT_REPOSITORY,
      useClass: DatabaseSalesProductRepository,
    },
  ],
})
export class SalesModule {}
