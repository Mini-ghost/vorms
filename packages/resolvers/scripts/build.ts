import { execSync as exec } from 'child_process';
import consola from 'consola';

async function build() {
  const start = Date.now();

  consola.log('Clean up');
  exec('pnpm clean', { stdio: 'inherit' });

  consola.log('Run Rollup build');
  exec('pnpm build:rollup', { stdio: 'inherit' });

  consola.success(`Build Success in ${Date.now() - start}ms`);
}

async function execBuild() {
  try {
    await build();
  } catch (error) {
    consola.error(error);
  }
}

if (require.main === module) {
  execBuild();
}
