import * as Yup from 'yup';

import type Lazy from 'yup/lib/Lazy';
import type { FormValues, FormErrors } from '@vue-composition-form/core';

export type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(
  schema: T,
) => <Values extends FormValues = FormValues>(
  values: Values,
) => Promise<FormErrors<any> | void>;
