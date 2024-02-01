import { ApiProperty } from '@nestjs/swagger';
import { HttpMethodEnum } from '../../../../../../infrastructure/shared/enums/httpMethod.enum';
import { adjustPriceResource, salesProductResource } from '../../../../shared/resources';

export class Link {
  @ApiProperty({ example: 'AdjustPrice' })
  name!: string;

  @ApiProperty({ example: `/${salesProductResource}/${adjustPriceResource}` })
  path!: string;

  @ApiProperty({ enum: HttpMethodEnum, example: HttpMethodEnum.PUT })
  method!: HttpMethodEnum;

  @ApiProperty({ example: '01HJVWG4R8YY7RW94B6ADFAHP7' })
  id?: unknown;
}
