// E2Eテスト用のビルド(`pnpm run e2e:build`)
// 英単語詳細ページ(/englishBot/detailWord/[id])はビルド時にAPI(/english/word/num)から単語数を取得してページを作るため、
// ビルドの間だけそのAPIに答えるスタブサーバーを立てる。これがないと詳細ページが1つも作られない
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const PORT = 3000;
const API_SERVER = `http://127.0.0.1:${PORT}/api`;
// 作られる詳細ページは id=1〜(MAX_WORD_ID+30)
const MAX_WORD_ID = 10;

const stub = createServer((req, res) => {
  if (req.url?.startsWith('/api/english/word/num')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ _max: { id: MAX_WORD_ID } }));
    return;
  }
  res.writeHead(404).end();
});

stub.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`ポート${PORT}が使用中のため、E2E用ビルドのスタブサーバーを起動できません。起動中のサーバーを止めてから再実行してください`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

stub.listen(PORT, '127.0.0.1', () => {
  const build = spawn('pnpm', ['exec', 'next', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_API_SERVER: API_SERVER,
      NEXT_PUBLIC_URL_END: '/',
      NEXT_PUBLIC_MOCK_MODE: 'false'
    }
  });
  build.on('exit', (code) => {
    stub.close();
    process.exit(code ?? 1);
  });
});
