import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/config';
import { ProductEntity } from '../../sales/application/entities/product.entity';
import { SalesProductRequestEntity } from '../idempotency/entities/salesProductRequest.entity';
import { SalesProductMessage } from '../messages/entities/salesProductMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [ProductEntity, SalesProductRequestEntity, SalesProductMessage],
      synchronize: config.database.synchronize,
    }),
  ],
})
export class DatabaseModule {}
