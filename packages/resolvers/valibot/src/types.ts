import { ObjectSchema } from 'valibot';

import type { FormErrors, FormValues } from '@vorms/core';

export type Resolver = <T extends ObjectSchema<any, any>>(
  schema: T,
) => <Values extends FormValues = FormValues>(
  values: Values,
) => Promise<FormErrors<any> | void>;
