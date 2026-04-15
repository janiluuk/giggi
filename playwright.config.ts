import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/web/e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"]
      }
    }
  ],
  webServer: {
    command: "pnpm --filter @giggi/web exec next dev --port 3100",
    port: 3100,
    reuseExistingServer: false,
    timeout: 120000
  }
});
