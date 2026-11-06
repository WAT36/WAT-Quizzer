// E2Eテスト用のビルド(`pnpm run e2e:build`)
import { spawn } from 'node:child_process';

const build = spawn('pnpm', ['exec', 'next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_API_SERVER: 'http://127.0.0.1:3000/api',
    NEXT_PUBLIC_URL_END: '/',
    NEXT_PUBLIC_MOCK_MODE: 'false'
  }
});
build.on('exit', (code) => {
  process.exit(code ?? 1);
});
