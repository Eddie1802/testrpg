---
name: writing-playwright-tests
description: Use when writing, editing or reviewing Playwright tests for TestRPG in this repo (tests/*.spec.ts) — covers the page object + fixture structure, locator strategy, assertions, test isolation and app-specific behaviours to account for.
---

# Writing Playwright tests for TestRPG

Requirements and acceptance criteria come from `notes/requirements.md`; derive test cases from there.

## Best practices

- Test user-visible behaviour, not implementation details (function names, data structures, CSS classes).
- Keep tests isolated: No dependencies on other tests, use before and after hooks for repetitive steps.
- Don't test third-party dependencies; stub their responses with `page.route`.
- Control test data; test against a stable environment.
- Use built-in locators (they auto-wait and retry), chained and filtered to narrow scope; see Locator strategy.
- Use web-first assertions (`await expect(locator)...`), never manual checks like `expect(await locator.isVisible()).toBe(true)`.
- Use `expect.soft()` for multiple independent checks in one test.
- Debug by driving the running app with the Playwright MCP server or playwright-cli.
- Test across browsers with projects (chromium, firefox, webkit).
- Keep `@playwright/test` up to date.
- Lint and type-check: enable `@typescript-eslint/no-floating-promises` and run `tsc --noEmit`.

## Page objects as fixtures

Specs never touch `page` locators directly; they use page objects that are handed to the test as fixtures.

- `pageobjects/<name>.page.ts` — one class per page (e.g. `PlayPage` for `/play`). It owns the locators (public `readonly` properties, or methods returning a `Locator` when they take arguments) and the actions (`goto()`, `startCharacter()`, `selectBuild()`). The locator strategy below applies here. Constructor takes `page: Page`. **Page objects contain no `expect` calls** and don't import `expect`; every assertion lives in the spec file.
- `fixtures/testrpgfixture.ts` — extends Playwright's `test` with one fixture per page object (e.g. `playPage`). The fixture creates the page object and navigates to its page (`goto()`) before `use()`, so specs need no `beforeEach` for navigation. The file re-exports `expect`.
- `tests/*.spec.ts` — import `test` and `expect` from `../fixtures/testrpgfixture`, never from `@playwright/test`, and take the page object in the test signature: `test("...", async ({ playPage }) => { ... })`. Specs contain the scenarios and all `expect(...)` calls on page object locators; selectors and click sequences live in the page object. Write the assertions out in each test, even when they repeat across tests: no assertion helper functions, neither in the page object nor in the spec, and no loops over assertions.
- `tests/data/` — shared test data (e.g. `buildtypes.ts` with the stats per build); page objects and specs both import from it. Mirror the app's values; don't invent them.

Adding a new page: create `pageobjects/<name>.page.ts`, register it as a fixture in `testrpgfixture.ts`, then write the spec. Keep specs named after the page (`play.spec.ts`) and group tests by requirement with `test.describe("FR-01 ...")`.

## Locator strategy

Test user-visible behaviour: interact with what users see, not CSS classes or DOM structure. Prefer user-facing attributes, even though the app exposes `data-testid` hooks. Pick the first option from this list that identifies the element uniquely (order follows the [Playwright locators page](https://playwright.dev/docs/locators)):

1. `getByRole()` with an accessible `name` — first choice, especially for interactive elements (buttons, links, checkboxes, comboboxes, sliders, dialogs)
2. `getByText()` — non-interactive elements (`div`, `span`, `p`), e.g. messages and confirmations
3. `getByLabel()` — form fields with a label
4. `getByPlaceholder()` — inputs with a placeholder but no label
5. `getByAltText()` — images and other elements with alt text
6. `getByTitle()` — elements with a `title` attribute
7. `getByTestId()` — last built-in resort, only when none of the above can identify the element (e.g. the draggable inventory items/slots, character sprite, progress bars). The hooks are listed in the root `../README.md` ("Test automation hooks").

Avoid CSS/XPath `page.locator()` selectors; they break when the DOM changes.

Narrow scope by chaining and filtering rather than reaching for brittle selectors:

```ts
page.getByTestId("adventure-clicker").getByRole("button");
page.getByRole("listitem").filter({ hasText: "Product 2" }).getByRole("button", { name: "Add" });
```

Extra data attributes (`data-character-stats`, `data-task`, `data-item-name`, `data-item-type`, `data-toast-type`) are for assertions where user-facing attributes cannot distinguish elements; reach them through a `getByTestId()` chain or a web-first attribute assertion (`toHaveAttribute`).

To discover resilient locators, inspect the running app (`http://localhost:3000`) with the Playwright MCP server or playwright-cli rather than guessing selectors.

## Assertions

- Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText`, `toBeDisabled`); they auto-wait and retry.
- Never assert on manual checks such as `expect(await locator.isVisible()).toBe(true)`.
- Use `expect.soft()` when one test checks several independent things.
- Don't use fixed sleeps. For the 3s toast auto-dismiss, assert with `await expect(toast).toBeHidden()` (default timeout is 5s).

## Structure and isolation

- Each test must be independent: no shared state or ordering between tests. Shared setup such as navigating to the page belongs in the page object fixture; use `test.beforeEach` only for setup that is not covered by a fixture.
- `baseURL` is configured, so use relative paths (`page.goto("/inventory")`).
- Tests run in chromium, firefox and webkit with `fullyParallel`; write them to pass in all three.
- Use Yoda conditions: put the constant on the left and the variable on the right (`"webkit" === browserName`, not `browserName === "webkit"`).
- Mark a test that is known to fail in one browser with a conditional `test.fixme()` at the start of the test, with the reason inline (no shared constant) and a pointer to `./notes/issues_found.md`: `test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");`. Destructure `browserName` in the test signature.
- Don't test third-party dependencies; stub them with `page.route` if any appear.
- `await` every Playwright call (enable `@typescript-eslint/no-floating-promises` if linting is added).

## App-specific behaviours

- Custom builds created through `POST /api/builds` are in-memory (reset on server restart), shared across parallel tests, and names are case-insensitive and lowercased. Use unique names per test; built-in names (`thief`, `knight`, `mage`, `brigadier`) return 409. For API tests use the `request` fixture.
- Toasts auto-dismiss after 3s; each completed task disables its input; the typer easter egg `all your base are belong to us` enables berserk mode (level-ups max out stats).
- Character state lives in a Zustand store and resets on reload.
- `/inventory` uses drag-and-drop with 2 weapon + 2 armor slots; a wrong slot type or occupied slot gives an error toast and leaves the item in the bag. Use `locator.dragTo()`.
