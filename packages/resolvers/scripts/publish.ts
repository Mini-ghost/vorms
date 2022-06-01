import { execSync as exec } from 'child_process';
import path from 'path';
import { readJSONSync } from 'fs-extra';
import consola from 'consola';

exec('pnpm build', { stdio: 'inherit' });

const command = 'npm publish --access public';

const { name, version } = readJSONSync(
  path.resolve(__dirname, '../package.json'),
  'utf-8',
);

const isBeta: boolean = version.includes('beta');

exec(`${command}${isBeta ? ' --tag beta' : ''}`, { stdio: 'inherit' });

consola.success(`Published ${name} v${version}`);
