import path from 'path';
import { readJSONSync } from 'fs-extra';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import type { RollupOptions, OutputOptions } from 'rollup';

const { source } = readJSONSync(
  path.resolve(__dirname, '../package.json'),
  'utf-8',
);

const configs: RollupOptions[] = [];
const formats = ['esm', 'cjs', 'umd'] as const;

for (const format of formats) {
  // A file with the extension ".mjs" will always be treated as ESM, even when pkg.type is "commonjs" (the default)
  // https://nodejs.org/docs/latest/api/packages.html#packages_determining_module_system
  const ext = format === 'esm' ? 'mjs' : 'js';

  const output: OutputOptions = {
    name: 'VueCompositionForm',
    file: `dist/index.${[format, ext].join('.')}`,
    format,
    globals: {
      vue: 'Vue',
    },
  };

  configs.push({
    input: source,
    output,
    external: ['vue'],
    plugins: [
      replace({
        values: {
          __DEV__:
            format === 'esm'
              ? `(process.env.NODE_ENV !== 'production')`
              : 'false',
        },
      }),
      typescript({
        clean: true,
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

export default configs;
