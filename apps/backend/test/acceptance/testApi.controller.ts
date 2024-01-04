import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('test-api')
export class TestApiController {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  @Post('clean-db')
  async cleanDB(): Promise<void> {
    await this.dataSource.query(`DELETE FROM sales_product_outbox_messages`);
    await this.dataSource.query(`DELETE FROM sales_product_requests`);
    await this.dataSource.query(`DELETE FROM sales_products`);
  }
}
