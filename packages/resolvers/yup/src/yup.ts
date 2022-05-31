import Yup from 'yup';
import { toNestError } from '@vue-composition-form/resolvers';
import type { Resolver } from './types';
/**
 * Why `path!` ? because it could be `undefined` in some case
 * https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
 */
const parseErrorSchema = (error: Yup.ValidationError) => {
  return (error.inner || []).reduce<Record<string, string>>(
    (previous, error) => {
      if (!previous[error.path!]) {
        previous[error.path!] = error.message;
      }

      return previous;
    },
    {},
  );
};

export const yupResolver: Resolver = (schema) => async (values) => {
  try {
    await schema.validate(values, {
      strict: true,
      abortEarly: false,
    });

    return;
  } catch (errors: any) {
    if (!errors.inner) {
      throw errors;
    }

    return toNestError(parseErrorSchema(errors));
  }
};
