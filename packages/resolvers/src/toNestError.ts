import { set } from '@vorms/core';

import type { FormErrors, FormValues } from '@vorms/core';

export const toNestError = (
  errors: Record<string, string>,
): FormErrors<FormValues> => {
  const fieldErrors = {};
  for (const path in errors) {
    set(fieldErrors, path, errors[path]);
  }

  return fieldErrors;
};
