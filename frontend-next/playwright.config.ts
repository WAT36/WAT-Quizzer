import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { coverageOptions } from './e2e/support/coverage-options';

// カバレッジ計測(pnpm run e2e:coverage)の時だけ、monocart-reporterで実行されたコードを集計する
// 結果は e2e-coverage/ に出力される(coverage/index.html が詳細、coverage/coverage-summary.md が要約)
const coverageReporter: ReporterDescription[] =
  process.env.E2E_COVERAGE === 'true'
    ? [
        [
          'monocart-reporter',
          { name: 'WAT-Quizzer E2E Coverage', outputFile: './e2e-coverage/index.html', coverage: coverageOptions }
        ]
      ]
    : [];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // test.onlyの消し忘れでCIが一部のテストしか実行しないのを防ぐ
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ...(process.env.CI ? [['github'] as ReporterDescription] : [['list'] as ReporterDescription]),
    ['html', { open: 'never' }],
    ...coverageReporter
  ],
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
