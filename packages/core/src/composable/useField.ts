import { useInternalContext } from './useInternalContext';

import type { FieldValidator, MaybeRef, UseFormRegisterReturn } from '../types';

type UseFieldOptions<Value> = {
  validate?: FieldValidator<Value>;
};

/**
 * Custom composition API that will return specific field value, meta (state) and attributes.
 *
 * @param name - field name
 *
 * @param options - field configuration and validation parameters. {@link UseFieldOptions}
 *
 * @returns field value, meta (state) and attributes. {@link UseFormRegisterReturn}
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { handleSubmit } = useForm({
 *   initialValues: {
 *     name: '',
 *   },
 *   onSubmit(values) {
 *     console.log({ values });
 *   },
 * });
 *
 * const { value: name, attrs: nameAttrs } = useField('name')
 * </script>
 *
 * <template>
 *   <form v-on:submit="handleSubmit">
 *     <input v-model="name" type="text" v-bind="nameAttrs" />
 *     <input type="submit" />
 *   </form>
 * </template>
 * ```
 */
export function useField<Value>(
  name: MaybeRef<string>,
  options: UseFieldOptions<Value> = {},
): UseFormRegisterReturn<Value> {
  const { registerField, getFieldValue, getFieldAttrs, getFieldMeta } =
    useInternalContext();

  registerField(name, options);

  return {
    value: getFieldValue<Value>(name),
    attrs: getFieldAttrs(name),
    ...getFieldMeta(name),
  };
}
