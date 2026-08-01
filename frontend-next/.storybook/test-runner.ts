import type { TestRunnerConfig } from '@storybook/test-runner';
import { waitForPageReady } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    // ストーリー（特にRecoil等、非同期チャンクをまたぐ状態管理を使うもの）の
    // レンダリングが完全に落ち着くのを待ってからチェックする
    await waitForPageReady(page);
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      },
      axeOptions: {
        rules: {
          // MUI X DataGrid の role="grid" 内部構造が axe の厳密な ARIA grid 仕様と一致しないための既知の誤検知
          'aria-required-children': { enabled: false }
        }
      }
    });
  }
};

export default config;
