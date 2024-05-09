import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSalesProductEventPayloadChanges } from './createSalesProductEventPayloadChanges.dto';

export class CreateSalesProductEventPayload {
  @IsNotEmpty()
  @Type(() => CreateSalesProductEventPayloadChanges)
  @ValidateNested()
  changes!: CreateSalesProductEventPayloadChanges;

  @IsNotEmpty()
  @IsString()
  productId!: string;
}
