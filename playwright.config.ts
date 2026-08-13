import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { hashSync } from "bcryptjs";

const e2ePassword =
  process.env.E2E_SITE_PASSWORD ?? randomBytes(24).toString("base64url");
const e2eAuthSecret =
  process.env.E2E_AUTH_SECRET ?? randomBytes(48).toString("base64url");
process.env.E2E_SITE_PASSWORD = e2ePassword;
process.env.E2E_AUTH_SECRET = e2eAuthSecret;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  // A serial file run keeps shared test-storage state deterministic.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run build -- --webpack && npm run start:test",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      E2E_TEST_MODE: "1",
      AUTH_SECRET: e2eAuthSecret,
      SITE_PASSWORD_HASH: hashSync(e2ePassword, 10),
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "ipad-webkit",
      use: {
        ...devices["iPad (gen 7)"],
        viewport: { width: 820, height: 1180 },
      },
    },
  ],
});
