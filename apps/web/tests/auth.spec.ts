import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const screenshotRoot = path.resolve(__dirname, "../../../docs/screenshots/phase-1");

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

test("phase 1: register, sign in, verify phone, edit profile (with screenshots)", async ({
  page,
}) => {
  ensureDir(screenshotRoot);

  const uniq = `${Date.now()}`;
  const email = `test+${uniq}@example.com`;
  const password = `Password-${uniq}`;
  const nickname = `Test${uniq.slice(-4)}`;

  await page.goto("/sign-up");
  await page.screenshot({ path: path.join(screenshotRoot, "01-sign-up.png"), fullPage: true });

  await page.getByLabel("Nickname").fill(nickname);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  // Sign-up creates the account; sign-in is tested as a distinct step.
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect
    .poll(async () => {
      const me = await page.request.get("/api/me");
      const meJson = (await me.json()) as { user: unknown | null };
      return meJson.user;
    })
    .not.toBeNull();

  await page.goto("/");

  await expect(page.getByText("Signed in as")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotRoot, "02-home-signed-in.png"), fullPage: true });

  await page.goto("/verify-phone");
  await expect(page.getByRole("heading", { name: "Verify your phone" })).toBeVisible();
  await page.screenshot({ path: path.join(screenshotRoot, "03-verify-phone-idle.png"), fullPage: true });

  await page.getByLabel("Phone (E.164)").fill("+358401234567");
  await page.getByRole("button", { name: "Send code" }).click();
  const devCodeBox = page.getByText("Dev code:");
  await expect(devCodeBox).toBeVisible();

  const devCodeText = await devCodeBox.textContent();
  const codeMatch = devCodeText?.match(/(\d{6})/);
  expect(codeMatch?.[1]).toBeTruthy();
  const code = codeMatch?.[1] ?? "";

  await page.getByLabel("Verification code").fill(code);
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.getByText("Verified")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotRoot, "04-verify-phone-verified.png"), fullPage: true });

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  await page.screenshot({ path: path.join(screenshotRoot, "05-profile-idle.png"), fullPage: true });

  await page.getByLabel("Bio").fill("Helsinki-based helper. Fast, friendly, reliable.");
  await page.getByLabel("Skills").fill("Cleaning, moving, errands");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotRoot, "06-profile-saved.png"), fullPage: true });
});

