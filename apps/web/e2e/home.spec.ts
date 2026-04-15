import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

async function ensureDir(target: string) {
  await fs.mkdir(target, { recursive: true });
}

test("captures the desktop home shell", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop screenshot only applies to desktop project");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find help or jump into a paid task"
  );

  const targetDir = path.join(process.cwd(), "docs/screenshots/phase-0");
  await ensureDir(targetDir);
  await page.screenshot({
    fullPage: true,
    path: path.join(targetDir, "home-desktop-light.png")
  });
});

test("captures the mobile menu state", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile menu screenshot only applies to mobile project");

  await page.goto("/");
  const targetDir = path.join(process.cwd(), "docs/screenshots/phase-0");
  await ensureDir(targetDir);
  await page.screenshot({
    fullPage: true,
    path: path.join(targetDir, "home-mobile-light.png")
  });

  await page.getByRole("button", { name: "JS" }).first().click();
  await expect(page.getByLabel("Mobile secondary menu").getByText("Saved searches")).toBeVisible();
  await page.screenshot({
    fullPage: true,
    path: path.join(targetDir, "home-mobile-menu-light.png")
  });
});
