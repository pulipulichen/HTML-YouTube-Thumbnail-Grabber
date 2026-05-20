# HTML YouTube Thumbnail Grabber

[English](./README.md) | [繁體中文](./README_zh_tw.md)

一個輕量的前端工具，可從 YouTube 影片連結快速取得封面縮圖網址。

## 線上展示

- [GitHub Pages](https://pulipulichen.github.io/HTML-YouTube-Thumbnail-Grabber/)

## 功能特色

- 支援解析常見 YouTube 網址格式，包含：
  - `youtube.com/watch?v=...`
  - `youtu.be/...`
  - `youtube.com/shorts/...`
  - `youtube.com/embed/...`
- 可產生並預覽多種封面尺寸：
  - `maxresdefault.jpg`
  - `sddefault.jpg`
  - `hqdefault.jpg`
  - `mqdefault.jpg`
  - `default.jpg`
- 當最高畫質封面不存在時，會自動降級顯示 HQ 封面。
- 可在介面中一鍵複製圖片網址。
- 內建 PWA 設定（`manifest.json` + `sw.js`），提供基本離線殼層快取。

## 技術堆疊

- HTML + CSS + Vanilla JavaScript
- [Tailwind CSS CDN](https://cdn.tailwindcss.com)
- [Font Awesome CDN](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)
- Playwright（E2E 測試）
- Docker Compose（測試執行）

## 使用方式

### 啟動專案

此專案為純前端靜態頁面，你可以：

- 直接用瀏覽器開啟 `index.html`，或
- 透過任意靜態伺服器進行部署/啟動

### 操作步驟

1. 在輸入框貼上 YouTube 影片網址。
2. 點擊 `立即抓取`。
3. 預覽可用的封面尺寸。
4. 開啟原圖或複製圖片網址。

## E2E 測試

此專案已設定可在 Docker 內執行 Playwright E2E 測試。

```bash
docker compose up --build --exit-code-from test-runner
```

或使用 npm script：

```bash
npm start
```

> 注意：`npm start` 目前會用 `sudo` 執行 Docker Compose，因此你的環境可能需要先完成 Docker 權限設定。

## CI

GitHub Actions workflow：

- `.github/workflows/e2e.yml`

此 workflow 會在推送或 PR 到 `main` / `master` 時執行 E2E 測試，也支援手動觸發（`workflow_dispatch`）。
