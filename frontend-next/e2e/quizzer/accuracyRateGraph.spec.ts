import { test, expect } from '../support/fixtures';
import { mockQuizzerMasterData } from '../support/data';

test.describe('quizzer / 正解率グラフ', () => {
  test.beforeEach(async ({ page, api }) => {
    mockQuizzerMasterData(api);

    await page.goto('/quizzer/accuracyRateGraph/');
  });

  test('選択中のトグルをもう一度押しても、選択は解除されない', async ({ page }) => {
    for (const name of ['Bar', 'Rate']) {
      const toggle = page.getByRole('button', { name, exact: true });
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');

      await toggle.click();

      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('トグルでグラフの種類と表示順を切り替えられる', async ({ page }) => {
    for (const [from, to] of [
      ['Bar', 'Radar'],
      ['Rate', 'Name']
    ]) {
      await page.getByRole('button', { name: to, exact: true }).click();

      await expect(page.getByRole('button', { name: to, exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('button', { name: from, exact: true })).toHaveAttribute('aria-pressed', 'false');
    }
  });
});
