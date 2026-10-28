import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      testIgnore: /api\..*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      testIgnore: /api\..*\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      testIgnore: /api\..*\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },

    /* API tests (api.*.spec.ts) run once. On CI they run after the browser projects have finished. */
    {
      name: "api",
      testMatch: /api\..*\.spec\.ts/,
      dependencies: process.env.CI ? ["chromium", "firefox", "webkit"] : [],
    },
  ],

  webServer: {
    command: "pnpm dev",
    cwd: "..",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
  },
});
