import { set } from '@vue-composition-form/core';
import type { FormValues, FormErrors } from '@vue-composition-form/core';

export const toNestError = (
  errors: Record<string, string>,
): FormErrors<FormValues> => {
  const fieldErrors = {};
  for (const path in errors) {
    set(fieldErrors, path, errors[path]);
  }

  return fieldErrors;
};
