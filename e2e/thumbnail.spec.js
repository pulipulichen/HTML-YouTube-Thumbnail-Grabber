import { test, expect } from '@playwright/test';

test('應該能正確抓取 YouTube 封面圖', async ({ page }) => {
  // 1. Navigate to the app
  await page.goto('http://localhost:8080');

  // 2. Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. Enter a video URL
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  await page.fill('#videoUrl', videoUrl);

  // 4. Click fetch button
  await page.click('#getThumbnailsBtn');

  // 5. Validate results
  const results = page.locator('#results');
  await expect(results).toBeVisible();

  const maxResImg = page.locator('#maxResImg');
  await expect(maxResImg).toHaveAttribute('src', /maxresdefault\.jpg/);

  // 6. Clear input
  await page.click('button:has(i.fa-redo)');
  await expect(results).toBeHidden();
  await expect(page.locator('#videoUrl')).toHaveValue('');

  // 7. Ensure no console errors were emitted
  expect(consoleErrors).toHaveLength(0);
});

test('輸入無效網址應顯示錯誤訊息', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.fill('#videoUrl', 'invalid-url');
  await page.click('#getThumbnailsBtn');

  const errorMsg = page.locator('#errorMessage');
  await expect(errorMsg).toBeVisible();
  await expect(page.locator('#results')).toBeHidden();
});

test('i18n 初始化應套用語系並同步選單', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const languageSelect = page.locator('#languageSelect');
  const selectedLanguage = await languageSelect.inputValue();
  await expect(page.locator('html')).toHaveAttribute('lang', selectedLanguage);

  if (selectedLanguage === 'zh-TW') {
    await expect(page.locator('h1')).toContainText('YouTube 封面抓取器');
  } else {
    await expect(page.locator('h1')).toContainText('YouTube Thumbnail Grabber');
  }
});

test('i18n 應可手動切換為繁中並即時更新文案', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.selectOption('#languageSelect', 'zh-TW');

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('h1')).toContainText('YouTube 封面抓取器');
  await expect(page.locator('#getThumbnailsBtn')).toContainText('立即抓取');
});

test('i18n 語系切換後應寫入 localStorage 並在重整後保留', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.selectOption('#languageSelect', 'zh-TW');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');

  const storedLanguage = await page.evaluate(() => localStorage.getItem('thumbnailGrabber_language'));
  expect(storedLanguage).toBe('zh-TW');

  await page.reload();
  await expect(page.locator('#languageSelect')).toHaveValue('zh-TW');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
});

test('點擊 4:3 範例網址應自動帶入並顯示封面', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const sampleButton43 = page.locator('.sample-url-btn[data-video-url="https://www.youtube.com/watch?v=jNQXAC9IVRw"]');
  await sampleButton43.click();

  await expect(page.locator('#videoUrl')).toHaveValue('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#sdImg')).toHaveAttribute('src', /\/vi\/jNQXAC9IVRw\/sddefault\.jpg/);
  await expect(page.locator('#errorMessage')).toBeHidden();
});

test('點擊 16:9 範例網址應自動帶入並顯示封面', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const sampleButton169 = page.locator('.sample-url-btn[data-video-url="https://www.youtube.com/watch?v=M7lc1UVf-VE"]');
  await sampleButton169.click();

  await expect(page.locator('#videoUrl')).toHaveValue('https://www.youtube.com/watch?v=M7lc1UVf-VE');
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#sdImg')).toHaveAttribute('src', /\/vi\/M7lc1UVf-VE\/sddefault\.jpg/);
  await expect(page.locator('#errorMessage')).toBeHidden();
});
