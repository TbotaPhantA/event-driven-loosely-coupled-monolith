import { ClassConstructor, ClassTransformOptions } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validatePayload<T extends Record<string, any>, V extends Record<string, any>>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): Promise<T> {
  const payload = plainToInstance(cls, plain, options);
  const errors = await validate(payload);
  if (errors.length > 0) { throw new Error(JSON.stringify(errors)); }
  return payload;
}
