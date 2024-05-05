import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Validate } from '../../../infrastructure/shared/decorators/validate';
import { HttpExceptionFilter } from '../../../infrastructure/shared/exceptionFilters/httpException.filter';
import { storageInventoryItemResource } from '../shared/resources';

@Controller(storageInventoryItemResource)
@ApiTags(storageInventoryItemResource)
@Validate()
@UseFilters(HttpExceptionFilter)
export class InventoryItemController {

}
