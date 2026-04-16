import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const screenshotRoot = path.resolve(__dirname, "../../../docs/screenshots/phase-1");

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

test("phase 1: demo UI views (home feed, gig detail, search)", async ({ page }) => {
  ensureDir(screenshotRoot);

  await page.goto("/demo/home-feed");
  await page.screenshot({
    path: path.join(screenshotRoot, "07-demo-home-feed.png"),
    fullPage: true,
  });

  await page.goto("/demo/gig-detail");
  await page.screenshot({
    path: path.join(screenshotRoot, "08-demo-gig-detail.png"),
    fullPage: true,
  });

  await page.goto("/demo/gig-search");
  await page.screenshot({
    path: path.join(screenshotRoot, "09-demo-gig-search.png"),
    fullPage: true,
  });
});

