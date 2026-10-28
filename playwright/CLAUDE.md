# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

This repo is a Playwright test-automation POC (`playwright/`, the working directory) for the TestRPG app that lives one level up (`../`, a React 18 + Vite + TypeScript app). [notes/requirements.md](notes/requirements.md) is the source of truth for requirements and acceptance criteria (scope, functional requirements, Given/When/Then criteria) — read it before writing tests, and keep it updated when requirements change.

- `playwright/` — the test project (its own `package.json`, `@playwright/test`, ESM). Structure: `tests/` (specs, plus `tests/data/` for shared test data), `pageobjects/` (page object classes), `fixtures/testrpgfixture.ts` (exposes the page objects as Playwright fixtures; specs import `test`/`expect` from there). `tests/example.spec.ts` is the generated sample.
- `playwright/notes/requirements.md` — source of truth for requirements/acceptance criteria. Other files in `notes/` (e.g. `steps.md`) are the user's personal notepad: do not read or use them.
- `../` — the app under test: `src/pages/` (home, play, inventory, api), `src/components/rpg/store.ts` (Zustand character state), `server.ts` (local Express API), `api/builds.ts` (Vercel serverless equivalent).

## Commands

Package manager is pnpm (the root has a `pnpm-workspace.yaml`).

From `playwright/`:

```bash
pnpm install
pnpm exec playwright install          # browsers
pnpm exec playwright test             # all tests, chromium + firefox + webkit
pnpm exec playwright test tests/foo.spec.ts            # one file
pnpm exec playwright test -g "test title"              # one test by name
pnpm exec playwright test --project=chromium           # one browser
pnpm exec playwright test --ui                         # UI mode
pnpm exec playwright show-report
```

`package.json` has no scripts. `playwright.config.ts` starts the app itself via `webServer` (`pnpm dev` with `cwd: ".."`, waits on `http://localhost:3000`, reuses an already running server locally). `baseURL` is `http://localhost:3000`, so use relative `page.goto("/play")`.

From the repo root (`../`): `pnpm dev` (Express API on :3001 + Vite on :3000, Vite proxies `/api/*`), `pnpm build`, `pnpm typecheck`.

## Writing tests

Use the `writing-playwright-tests` skill ([.claude/skills/writing-playwright-tests/SKILL.md](.claude/skills/writing-playwright-tests/SKILL.md)) for the page object + fixture structure, locator strategy, assertions and app-specific behaviours.

## CI

- CI workflow (`.github/workflows/playwright.yml`) currently only defines triggers (push/PR on main/master), no jobs yet.
