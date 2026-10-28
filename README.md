# Assignment

To whom it may concern: this is my deliverable of the TestCoders test automation assignment. For this assignment I forked the complete testrpg repo from https://github.com/micheltestcoders/testrpg and added Playwright end2end and api test to the [./playwright](./playwright) folder.

## Getting started

Make sure you have Node 20+ and pnpm installed. If pnpm is missing, run `corepack enable pnpm`.

```bash
# install the app dependencies
pnpm install

# install the test dependencies
cd playwright
pnpm install

# install the Playwright browsers (chromium, firefox, webkit)
pnpm exec playwright install --with-deps
```

## Running the tests

Run the tests from the `playwright` folder. The dev server is started automatically by the Playwright config, so there is no need to run `pnpm dev` first.

```bash
# run all tests (ui tests in all three browsers + api tests)
pnpm exec playwright test

# run a single project, e.g. only chromium or only the api tests
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=api

# open the html report of the last run
pnpm exec playwright show-report
```

## Project structure

The tests live in the [playwright](./playwright) folder, which is its own package (own `package.json` and dependencies). The app under test is the testrpg app in the repo root.

```
playwright/
├── tests/
│   ├── play.spec.ts           # UI tests for the /play page
│   ├── inventory.spec.ts      # UI tests for the /inventory page
│   ├── api.builds.spec.ts     # API tests for the /api/builds endpoint
│   └── data/
│       └── buildtypes.ts      # shared test data for the character types in the game
├── pageobjects/
│   ├── play.page.ts           # page object for the /play page
│   └── inventory.page.ts      # page object for the /inventory page
├── fixtures/
│   └── testrpgfixture.ts      # Fixture to expose the page objects as Playwright fixtures
├── notes/
│   ├── requirements.md        # requirements and acceptance criteria used to build test cases
│   ├── steps.md               # This files contains planning steps and notes for this assignment
│   └── issues_found.md        # issues found in the app during creation of the tests. Contains bugs and ovservations
├── .claude/
│   └── skills/
│       └── writing-playwright-tests/
│           └── SKILL.md       # Claude Code skill with the conventions for writing tests in this project
├── CLAUDE.md                  # Claude Code project guidance: layout, commands and CI
└── playwright.config.ts       # projects, baseURL and dev server startup
```

- **Specs** (`tests/`): UI specs run in chromium, firefox and webkit. API test (named `api.*.spec.ts`) run isolated from the UI tests in the separate `api` project. The reason for this isolation is that the builds api allows for adding custom charaters to the game. While these custom characters currently are not stored and won't affect the UI tests, a furture version of testrpg could introduce storage of custom characters.
- **Page objects** (`pageobjects/`): one class per page that holds the locators and actions, so specs stay readable and locators live in one place. Locators prioritize user-facing attributes and only use the `data-testid` attributes of the app as a fallback option.
- **Fixtures** (`fixtures/`): specs import `test` and `expect` from `testrpgfixture.ts` and get the page objects injected, allowing tests to use page objects as fixtures instead of constructing them in each test.
- **Claude Code setup** (`CLAUDE.md`, `.claude/skills/`): `CLAUDE.md` gives Claude Code the project layout, commands and CI notes. The `writing-playwright-tests` skill describes the page object and fixture structure, locator strategy, assertions and app-specific behaviours to account for when writing tests.
- **Config** (`playwright.config.ts`): defines the browser and api projects, sets `baseURL` to `http://localhost:3000` and starts the app with `pnpm dev` before the run.

## Github action

The workflow is defined in [.github/workflows/playwright.yml](.github/workflows/playwright.yml) and its runs can be viewed at https://github.com/Eddie1802/testrpg/actions/workflows/playwright.yml.

- **Triggers:** every push and pull request to `main` or `master`, and manually through `workflow_dispatch`.
- **Test job:** installs the app and test dependencies and the Playwright browsers, then runs all tests.
- **Report:** the HTML report is always uploaded as a `playwright-report` artifact on the run (kept for 14 days).
- **Hosted report:** on pushes to `main` the report is also published to GitHub Pages. The latest report is available at https://eddie1802.github.io/testrpg/.

## Credits

- Original repository by [micheltestcoders](https://github.com/micheltestcoders/testrpg)
- Character sprites by [Redshrike](https://opengameart.org/content/first-person-dungeon-crawl-protagonist) on opengameart.org.
