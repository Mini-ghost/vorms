import { inject, InjectionKey } from 'vue';
import type { UseFormReturn, FormValues } from '../types';

export type FormContextValuse<Values extends FormValues = FormValues> =
  UseFormReturn<Values>;

export const FormContextKey: InjectionKey<FormContextValuse<FormValues>> =
  Symbol(__DEV__ ? 'vue composition form context' : 'fx');

/**
 * Custom composition API that return form context
 *
 * @returns methods and state of form (As same as useForm). {@link FormContextValuse}
 *
 * @example
 * ```vue
 * <script setup lang="ts">
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
  const context = inject(FormContextKey) as FormContextValuse<Values>;
  return context;
}
