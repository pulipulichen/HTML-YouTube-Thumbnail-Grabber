# Changelog

## 0.0.1

### Added
- Introduced a modular i18n system with `en` and `zh-TW` dictionaries, browser language detection, and persisted language preference via `localStorage`.
- Added a language selector to the UI and wired translated labels/messages across page title, form controls, result sections, and toast notifications.
- Added GitHub Actions workflow at `.github/workflows/e2e.yml` to run Docker-based Playwright E2E tests on push, pull request, and manual dispatch.
- Added CI failure artifact uploads for `playwright-report/` and `playwright-report-videos/` in the GitHub Actions E2E workflow.
- Added `.jshintrc` and `.jslintrc` project lint configuration files.

### Changed
- Refactored frontend interactions in `index.html` and `script.js` to use module-based scripts, explicit button IDs, and event listeners instead of inline click handlers.
- Updated max-resolution thumbnail fallback behavior to show localized hint text when degrading to HQ thumbnails.

### Documentation
- Rewrote `README.md` with full project documentation, including features, usage, Docker-based E2E instructions, and CI details.
- Added bilingual documentation support by introducing `README_zh_tw.md` and cross-language links between English and Traditional Chinese guides.

### Testing
- Updated existing Playwright tests to use stable element selectors.
- Added E2E coverage for i18n initialization, runtime language switching, and language persistence after reload.
