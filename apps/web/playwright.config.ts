import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/giggi?schema=public\" " +
      "AUTH_URL=\"http://127.0.0.1:3000\" " +
      "AUTH_SECRET=\"dev-only\" " +
      "NEXTAUTH_URL=\"http://127.0.0.1:3000\" " +
      "NEXTAUTH_SECRET=\"dev-only\" " +
      "SMS_PROVIDER=\"mock\" " +
      "PHONE_VERIFICATION_CODE_TTL_SECONDS=\"600\" " +
      "npm run dev -- --port 3000",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

