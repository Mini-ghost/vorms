import { toNestError } from '@vorms/resolvers';
import { parseAsync, ValiError } from 'valibot';

import type { Resolver } from './types';
import type { SchemaIssues } from 'valibot';

const parseErrorSchema = (valibotIssues: SchemaIssues) => {
  const errors: Record<string, string> = {};

  while (valibotIssues.length) {
    const issue = valibotIssues[0];

    if (issue.path) {
      const path = issue.path.map((pares) => pares.key).join('.');

      if (!errors[path]) {
        errors[path] = issue.message;
      }
    }

    valibotIssues.shift();
  }

  return errors;
};

export const valibotResolver: Resolver = (schema) => async (values) => {
  try {
    await parseAsync(schema, values);
    return {};
  } catch (error: any) {
    if (error instanceof ValiError) {
      return error.issues.length
        ? toNestError(parseErrorSchema(error.issues))
        : {};
    }

    throw error;
  }
};
