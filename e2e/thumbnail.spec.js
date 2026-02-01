import { test, expect } from '@playwright/test';

test('應該能正確抓取 YouTube 封面圖', async ({ page }) => {
  // 1. 前往應用程式
  await page.goto('http://localhost:8080');

  // 2. 設定 console error 追蹤
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. 輸入影片網址
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  await page.fill('#videoUrl', videoUrl);

  // 4. 點擊抓取按鈕
  await page.click('button:has-text("立即抓取")');

  // 5. 驗證結果
  const results = page.locator('#results');
  await expect(results).toBeVisible();

  const maxResImg = page.locator('#maxResImg');
  await expect(maxResImg).toHaveAttribute('src', /maxresdefault\.jpg/);

  // 6. 清除輸入
  await page.click('button:has(i.fa-redo)');
  await expect(results).toBeHidden();
  await expect(page.locator('#videoUrl')).toHaveValue('');

  // 7. 檢查是否有 console error
  // 注意：由於 img.onerror 可能會觸發（如果 maxres 不存在），所以我們可能需要忽略特定錯誤
  // 但在這個測試案例中，dQw4w9WgXcQ 應該是有 maxres 的
  expect(consoleErrors).toHaveLength(0);
});

test('輸入無效網址應顯示錯誤訊息', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.fill('#videoUrl', 'invalid-url');
  await page.click('button:has-text("立即抓取")');

  const errorMsg = page.locator('#errorMessage');
  await expect(errorMsg).toBeVisible();
  await expect(page.locator('#results')).toBeHidden();
});
