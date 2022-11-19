import { execSync as exec } from 'child_process';

exec('pnpm --filter @vorms/core publish:ci', { stdio: 'inherit' });
exec('pnpm --filter @vorms/resolvers publish:ci', { stdio: 'inherit' });
