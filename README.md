# HTML YouTube Thumbnail Grabber

[English](./README.md) | [繁體中文](./README_zh_tw.md)

A lightweight frontend tool for extracting YouTube thumbnail image URLs from a video link.

## Live Demo

- [GitHub Pages](https://pulipulichen.github.io/HTML-YouTube-Thumbnail-Grabber/)

## Features

- Parse common YouTube URL formats, including:
  - `youtube.com/watch?v=...`
  - `youtu.be/...`
  - `youtube.com/shorts/...`
  - `youtube.com/embed/...`
- Generate and preview multiple thumbnail sizes:
  - `maxresdefault.jpg`
  - `sddefault.jpg`
  - `hqdefault.jpg`
  - `mqdefault.jpg`
  - `default.jpg`
- Gracefully fallback to HQ thumbnail when max resolution is unavailable.
- Copy thumbnail URL to clipboard from the UI.
- Includes a PWA setup (`manifest.json` + `sw.js`) for basic offline shell caching.

## Tech Stack

- HTML + CSS + Vanilla JavaScript
- [Tailwind CSS CDN](https://cdn.tailwindcss.com)
- [Font Awesome CDN](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)
- Playwright for E2E tests
- Docker Compose for test execution

## Usage

### Run the App

This is a static frontend project. You can:

- Open `index.html` directly in your browser, or
- Deploy/serve the project with any static file server

### Use the Tool

1. Paste a YouTube video URL into the input field.
2. Click `立即抓取`.
3. Preview available thumbnail sizes.
4. Open the original image in a new tab or copy the image URL.

## E2E Testing

This repository is configured to run Playwright E2E tests inside Docker.

```bash
docker compose up --build --exit-code-from test-runner
```

Or via npm script:

```bash
npm start
```

> Note: `npm start` currently runs Docker Compose with `sudo`, so Docker permission setup may be required in your environment.

## CI

GitHub Actions workflow:

- `.github/workflows/e2e.yml`

It runs E2E tests on pushes and pull requests to `main` / `master`, and supports manual trigger (`workflow_dispatch`).
