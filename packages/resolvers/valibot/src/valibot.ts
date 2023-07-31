import { toNestError } from '@vorms/resolvers';
import { parse } from 'valibot';

import type { Resolver } from './types';
import type { Issues } from 'valibot';

const parseErrorSchema = (valibotIssues: Issues) => {
  const errors: Record<string, string> = {};

  while (valibotIssues.length) {
    const { path: _parse, message } = valibotIssues[0];
    const path = _parse!.map((pares) => pares.key).join('.');

    if (!errors[path]) {
      errors[path] = message;
    }

    valibotIssues.shift();
  }

  return errors;
};

export const zodResolver: Resolver = (schema) => async (values) => {
  try {
    parse(schema, values);
    return {};
  } catch (error: any) {
    if (error.name !== 'ValiError') throw error;
    return error.issues.length
      ? toNestError(parseErrorSchema(error.issues))
      : {};
  }
};
