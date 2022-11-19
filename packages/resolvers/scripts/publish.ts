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

const tag = version.includes('beta')
  ? 'beta'
  : version.includes('rc')
  ? 'rc'
  : null;

exec(`${command}${tag ? ` --tag ${tag}` : ''}`, { stdio: 'inherit' });

consola.success(`Published ${name} v${version}`);
