import { test, expect } from './support/fixtures';

test('存在しないページを開くと404の案内が表示される', async ({ page }) => {
  await page.goto('/not-found-page/');

  await expect(page.getByText('お探しのページは存在しません。')).toBeVisible();
});
