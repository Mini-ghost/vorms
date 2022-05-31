import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

import type { RollupOptions, OutputOptions } from 'rollup';

const nodules = [
  {
    path: '.',
    name: '',
    source: 'src/index.ts',
  },
];

const formats = ['esm', 'cjs', 'umd'] as const;

const configs: RollupOptions[] = [];

for (const module of nodules) {
  for (const format of formats) {
    const ext = format === 'esm' ? 'mjs' : 'js';

    const output: OutputOptions = {
      name: `VueCompositionForm${module.name}Resolver`,
      file: `${module.path}/dist/index.${[format, ext].join('.')}`,
      format,
      globals: {
        '@vue-composition-form/core': 'VueCompositionForm',
      },
    };

    configs.push({
      input: `./${module.source}`,
      output,
      external: ['@vue-composition-form/core'],
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            __DEV__:
              format === 'esm'
                ? `(process.env.NODE_ENV !== 'production')`
                : 'false',
          },
        }),
        typescript({
          clean: true,
          useTsconfigDeclarationDir: true,
        }),
        resolve(),
        commonjs(),
        format !== 'esm' &&
          terser({
            output: { comments: false },
            compress: {
              drop_console: true,
            },
          }),
      ],
    });
  }

  configs.push({
    input: `./${module.source}`,
    output: {
      file: `${module.path}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
  });
}

export default configs;
