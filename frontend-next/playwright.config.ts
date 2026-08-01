import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Read from default ".env" file.
dotenv.config();

// Alternatively, read from "../my.env" file.
dotenv.config({ path: path.resolve(__dirname, '.', '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* monocart-reporterがテスト結果レポートに加え、e2e/fixtures.tsで収集したV8カバレッジを集計する */
  reporter: [
    ['list'],
    [
      'monocart-reporter',
      {
        name: 'WAT-Quizzer E2E Test Report',
        outputFile: './monocart-report/index.html',
        coverage: {
          outputDir: './coverage-report',
          // inline: trueでJS/CSSアセットをHTMLに埋め込み、index.html単体でCIアーティファクトとして開けるようにする
          reports: [['v8', { inline: true }], ['json-summary']],
          // _next/static配下のアプリ本体JS/CSSのみを対象にする(node_modulesのvendorチャンクは除外)
          entryFilter: (entry: { url: string }) => entry.url.includes('/_next/static/'),
          // ソースマップ由来のパス(turbopack:///[project]/frontend-next/src/...)でsrc/配下(自前のコード)だけに絞る
          sourceFilter: (sourcePath: string) => sourcePath.includes('/frontend-next/src/') && !sourcePath.includes('node_modules')
        }
      }
    ]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Serve the mock-mode static export (built beforehand by `npm run export:mock`, see `e2e` script). DB不要・固定データのため、実DB環境を用意せずに起動できる。 */
  webServer: {
    command: 'npx serve ./out -l 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
