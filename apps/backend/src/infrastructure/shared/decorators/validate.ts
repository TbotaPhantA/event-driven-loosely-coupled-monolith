import { HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';

export const Validate = (): ReturnType<typeof UsePipes> => UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  })
);
