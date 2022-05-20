import { inject, InjectionKey } from 'vue';
import type { UseFormReturn, FormValues } from '../types';

export type FormContextValuse<Values extends FormValues = FormValues> =
  UseFormReturn<Values>;

export const FormContextKey: InjectionKey<FormContextValuse<FormValues>> =
  Symbol(__DEV__ ? 'vue composition form context' : 'fx');

export function useFormContext<Values extends FormValues = FormValues>() {
  const context = inject(FormContextKey) as FormContextValuse<Values>;
  return context;
}
