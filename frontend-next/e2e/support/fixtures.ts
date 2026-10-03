import { test as base, expect } from '@playwright/test';
import { ApiMock, createDummyAccessToken } from './api-mock';

// 各specはこのファイルからtest/expectをimportする
// - `api`を使うと、テストごとにAPIの応答を差し替えられる
// - 画面を開いた時点でログイン済みになるよう、/auth/refreshにダミーのaccessTokenを返しておく
export const test = base.extend<{ api: ApiMock }>({
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
  ]
});

export { expect };
