import { IsString, Length } from 'class-validator';
import { ULID_LENGTH } from '../../../../../infrastructure/shared/constants';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductParamsDto {
  @IsString()
  @Length(ULID_LENGTH)
  @ApiProperty({ example: '01HGNJHGSPJS3QM3ZGMY181ZX4' })
  productId!: string;
}
