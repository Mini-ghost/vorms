import { BaseSchema, BaseSchemaAsync } from 'valibot';

import type { FormErrors, FormValues } from '@vorms/core';

export type Resolver = <T extends BaseSchema | BaseSchemaAsync>(
  schema: T,
) => <Values extends FormValues = FormValues>(
  values: Values,
) => Promise<FormErrors<any> | void>;
