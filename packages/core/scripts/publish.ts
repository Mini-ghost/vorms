import { execSync as exec } from 'child_process';
import path, { resolve } from 'path';
import { readJSONSync, copyFileSync, removeSync } from 'fs-extra';
import consola from 'consola';

exec('pnpm build', { stdio: 'inherit' });

const command = 'npm publish --access public';

const { name, version } = readJSONSync(
  path.resolve(__dirname, '../package.json'),
  'utf-8',
);

const isBeta: boolean = version.includes('beta');
const readmePath = path.join(resolve(__dirname, '..'), 'README.md');

copyFileSync(
  path.join(resolve(__dirname, '../../..'), 'README.md'),
  readmePath,
);

exec(`${command}${isBeta ? ' --tag beta' : ''}`, { stdio: 'inherit' });

removeSync(readmePath);
consola.success(`Published ${name} v${version}`);
