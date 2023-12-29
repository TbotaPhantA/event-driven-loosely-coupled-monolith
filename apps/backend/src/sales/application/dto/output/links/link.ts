import { ApiProperty } from '@nestjs/swagger';
import { AdjustPrice } from '../../../../domain/salesProduct/commands/adjustPrice';
import { adjustPriceResource, salesProductResource } from '../../../sales.controller';
import { HttpMethodEnum } from '../../../../../infrastructure/shared/enums/httpMethod.enum';

export class Link {
  @ApiProperty({ example: AdjustPrice.name })
  name!: string;

  @ApiProperty({ example: `/${salesProductResource}/${adjustPriceResource}` })
  path!: string;

  @ApiProperty({ enum: HttpMethodEnum, example: HttpMethodEnum.PUT })
  method!: HttpMethodEnum;

  @ApiProperty({ example: '01HJVWG4R8YY7RW94B6ADFAHP7' })
  id?: unknown;
}
