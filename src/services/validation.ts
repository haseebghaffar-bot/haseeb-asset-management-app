import type { z } from 'zod';

export const createZodValidator = (schema: z.ZodType<any, any>) => {
  return (_rule: any, value: any, callback: any) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      callback(new Error(result.error.errors[0]?.message || 'Validation failed'));
    } else {
      callback();
    }
  };
};

export const zodField = (schema: any, field: string) => {
  let innerSchema = schema;
  while (innerSchema._def && innerSchema._def.schema) {
    innerSchema = innerSchema._def.schema;
  }

  const fieldSchema = innerSchema.shape?.[field];
  if (!fieldSchema) {
    console.warn(`Field "${field}" not found in schema`);
    return (_rule: any, _value: any, callback: any) => callback();
  }
  return createZodValidator(fieldSchema);
};
