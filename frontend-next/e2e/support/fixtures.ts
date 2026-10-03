import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';
import { ApiMock, createDummyAccessToken } from './api-mock';

// カバレッジ計測するか(pnpm run e2e:coverage で有効になる)
export const isCoverageEnabled = process.env.E2E_COVERAGE === 'true';

// 各specはこのファイルからtest/expectをimportする
// - `api`を使うと、テストごとにAPIの応答を差し替えられる
// - 画面を開いた時点でログイン済みになるよう、/auth/refreshにダミーのaccessTokenを返しておく
// - カバレッジ計測が有効な場合は、テストごとに実行されたJSを記録する
export const test = base.extend<{ api: ApiMock; coverage: void }>({
  api: [
    async ({ page }, use) => {
      const api = new ApiMock(page);
      api.on('POST', '/auth/refresh', { json: { accessToken: createDummyAccessToken() } });
      await api.start();

      await use(api);

      // 差し替えていないAPIが呼ばれていたら、画面が想定外の通信をしているのでテストを失敗させる
      expect(api.unhandled, '差し替えていないAPIが呼ばれました。api.on()で応答を登録してください').toEqual([]);
    },
    { auto: true }
  ],
  coverage: [
    async ({ page }, use, testInfo) => {
      if (!isCoverageEnabled) {
        await use();
        return;
      }
      // 画面遷移をまたいで記録し続ける
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
      await use();
      await addCoverageReport(await page.coverage.stopJSCoverage(), testInfo);
    },
    { auto: true }
  ]
});

export { expect };
