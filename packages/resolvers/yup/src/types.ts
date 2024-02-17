import * as Yup from 'yup';

import type { FormErrors, FormValues } from '@vorms/core';
import type { Lazy } from 'yup';

export type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(
  schema: T,
) => <Values extends FormValues = FormValues>(
  values: Values,
) => Promise<FormErrors<any> | void>;
