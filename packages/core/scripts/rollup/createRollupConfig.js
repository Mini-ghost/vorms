import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export function createRollupConfig(options, callback) {
  const name = options.name;

  // A file with the extension ".mjs" will always be treated as ESM, even when pkg.type is "commonjs" (the default)
  // https://nodejs.org/docs/latest/api/packages.html#packages_determining_module_system
  const ext = options.format === 'esm' ? 'mjs' : 'js';
  const output = 'dist/' + [name, options.format, ext].join('.');

  const config = {
    input: options.input,
    external: ['vue'],
    output: {
      file: output,
      format: options.format,
      name: 'VueComposableForm',
      sourcemap: true,
      globals: {
        vue: 'Vue',
      },
    },
    plugins: [
      typescript({
        tsconfig: options.tsconfig,
        clean: true,
      }),
      resolve({}),
      commonjs(),
      options.format !== 'esm' &&
        terser({
          output: { comments: false },
          compress: {
            drop_console: true,
          },
        }),
    ],
  };

  return callback ? callback(config) : config;
}
