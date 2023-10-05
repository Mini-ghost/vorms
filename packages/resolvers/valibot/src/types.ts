import { ObjectSchema, UnionSchema } from 'valibot';

import type { FormErrors, FormValues } from '@vorms/core';

type UnionObjectSchema = UnionSchema<
  [ObjectSchema<any, any>, ObjectSchema<any, any>, ...ObjectSchema<any, any>[]]
>;

export type Resolver = <T extends ObjectSchema<any, any> | UnionObjectSchema>(
  schema: T,
) => <Values extends FormValues = FormValues>(
  values: Values,
) => Promise<FormErrors<any> | void>;
