import { defineConfig, devices } from '@playwright/test';

// E2Eテストの設定
// - 対象は`pnpm run e2e:build`で書き出した静的サイト(./out)。バックエンドは起動せず、APIはテスト側でpage.route()により差し替える
// - ブラウザはインストール済みのGoogle Chromeを使う(GitHub Actionsのubuntu-latestにも入っているため、ブラウザのダウンロードが不要)
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // test.onlyの消し忘れでCIが一部のテストしか実行しないのを防ぐ
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    // 失敗したテストだけ操作の記録とスクリーンショットを残す(`pnpm exec playwright show-report`で確認できる)
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    }
  ],
  webServer: {
    command: 'serve ./out -l 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
