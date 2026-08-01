import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

// 各specはこのfixtureをimportするだけで、テストごとにV8カバレッジが自動収集される。
// カバレッジAPIはchromiumのみ対応のため、他ブラウザプロジェクトでは何もしない。
export const test = base.extend<{ autoTestFixture: string }>({
  autoTestFixture: [
    async ({ page }, use, testInfo) => {
      const isChromium = testInfo.project.name === 'chromium';

      if (isChromium) {
        await Promise.all([
          page.coverage.startJSCoverage({ resetOnNavigation: false }),
          page.coverage.startCSSCoverage({ resetOnNavigation: false })
        ]);
      }

      await use('autoTestFixture');

      if (isChromium) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          page.coverage.stopCSSCoverage()
        ]);
        await addCoverageReport([...jsCoverage, ...cssCoverage], testInfo);
      }
    },
    { scope: 'test', auto: true }
  ]
});

export { expect };
