import { inject, InjectionKey } from 'vue';

import type { FormValues, UseFormReturn } from '../types';

export type FormContextValues<Values extends FormValues = FormValues> =
  UseFormReturn<Values>;

export const FormContextKey: InjectionKey<FormContextValues<FormValues>> =
  Symbol(__DEV__ ? 'vorms context' : '');

/**
 * Custom composition API that return form context
 *
 * @returns methods and state of form (As same as useForm). {@link FormContextValues}
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useFormContext } from '@vorms/core'
 *
 * const { validateField } = useFormContext()
 * const { value, attrs } = useField('drink') // You can also use `register` return from `useFormContext()`
 * </script>
 *
 * <template>
 *   <input v-model="value" type="text" v-bind="attrs" />
 * </template>
 * ```
 */
export function useFormContext<Values extends FormValues = FormValues>() {
  const context = inject(FormContextKey) as FormContextValues<Values>;
  return context;
}
