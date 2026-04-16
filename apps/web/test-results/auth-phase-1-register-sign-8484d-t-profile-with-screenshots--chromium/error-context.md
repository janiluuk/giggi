# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> phase 1: register, sign in, verify phone, edit profile (with screenshots)
- Location: tests/auth.spec.ts:11:5

# Error details

```
Error: expect(received).not.toBeNull()

Received: null

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "giggi" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "Profile" [ref=e6] [cursor=pointer]:
          - /url: /profile
        - link "Verify phone" [ref=e7] [cursor=pointer]:
          - /url: /verify-phone
        - generic [ref=e8]:
          - link "Sign in" [ref=e9] [cursor=pointer]:
            - /url: /sign-in
          - link "Create account" [ref=e10] [cursor=pointer]:
            - /url: /sign-up
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "Sign in" [level=1] [ref=e13]
      - paragraph [ref=e14]:
        - text: New here?
        - link "Create an account" [ref=e15] [cursor=pointer]:
          - /url: /sign-up
        - text: .
      - generic [ref=e16]:
        - button "Continue with Google" [ref=e17]
        - generic [ref=e20]: or
        - generic [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e24]: Email
            - textbox "Email" [ref=e25]: test+1776344329669@example.com
          - generic [ref=e26]:
            - generic [ref=e27]: Password
            - textbox "Password" [ref=e28]: Password-1776344329669
          - generic [ref=e29]: Invalid email or password.
          - button "Sign in" [ref=e30]
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]:
    - img [ref=e37]
  - alert [ref=e40]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import fs from "node:fs";
  3  | import path from "node:path";
  4  | 
  5  | const screenshotRoot = path.resolve(__dirname, "../../../docs/screenshots/phase-1");
  6  | 
  7  | function ensureDir(p: string) {
  8  |   fs.mkdirSync(p, { recursive: true });
  9  | }
  10 | 
  11 | test("phase 1: register, sign in, verify phone, edit profile (with screenshots)", async ({
  12 |   page,
  13 | }) => {
  14 |   ensureDir(screenshotRoot);
  15 | 
  16 |   const uniq = `${Date.now()}`;
  17 |   const email = `test+${uniq}@example.com`;
  18 |   const password = `Password-${uniq}`;
  19 |   const nickname = `Test${uniq.slice(-4)}`;
  20 | 
  21 |   await page.goto("/sign-up");
  22 |   await page.screenshot({ path: path.join(screenshotRoot, "01-sign-up.png"), fullPage: true });
  23 | 
  24 |   await page.getByLabel("Nickname").fill(nickname);
  25 |   await page.getByLabel("Email").fill(email);
  26 |   await page.getByLabel("Password").fill(password);
  27 |   await page.getByRole("button", { name: "Create account" }).click();
  28 | 
  29 |   // Sign-up creates the account; sign-in is tested as a distinct step.
  30 |   await page.goto("/sign-in");
  31 |   await page.getByLabel("Email").fill(email);
  32 |   await page.getByLabel("Password").fill(password);
  33 |   await page.getByRole("button", { name: "Sign in" }).click();
  34 | 
> 35 |   await expect
     |   ^ Error: expect(received).not.toBeNull()
  36 |     .poll(async () => {
  37 |       const me = await page.request.get("/api/me");
  38 |       const meJson = (await me.json()) as { user: unknown | null };
  39 |       return meJson.user;
  40 |     })
  41 |     .not.toBeNull();
  42 | 
  43 |   await page.goto("/");
  44 | 
  45 |   await expect(page.getByText("Signed in as")).toBeVisible();
  46 |   await page.screenshot({ path: path.join(screenshotRoot, "02-home-signed-in.png"), fullPage: true });
  47 | 
  48 |   await page.goto("/verify-phone");
  49 |   await expect(page.getByRole("heading", { name: "Verify your phone" })).toBeVisible();
  50 |   await page.screenshot({ path: path.join(screenshotRoot, "03-verify-phone-idle.png"), fullPage: true });
  51 | 
  52 |   await page.getByLabel("Phone (E.164)").fill("+358401234567");
  53 |   await page.getByRole("button", { name: "Send code" }).click();
  54 |   const devCodeBox = page.getByText("Dev code:");
  55 |   await expect(devCodeBox).toBeVisible();
  56 | 
  57 |   const devCodeText = await devCodeBox.textContent();
  58 |   const codeMatch = devCodeText?.match(/(\d{6})/);
  59 |   expect(codeMatch?.[1]).toBeTruthy();
  60 |   const code = codeMatch?.[1] ?? "";
  61 | 
  62 |   await page.getByLabel("Verification code").fill(code);
  63 |   await page.getByRole("button", { name: "Verify" }).click();
  64 |   await expect(page.getByText("Verified")).toBeVisible();
  65 |   await page.screenshot({ path: path.join(screenshotRoot, "04-verify-phone-verified.png"), fullPage: true });
  66 | 
  67 |   await page.goto("/profile");
  68 |   await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  69 |   await page.screenshot({ path: path.join(screenshotRoot, "05-profile-idle.png"), fullPage: true });
  70 | 
  71 |   await page.getByLabel("Bio").fill("Helsinki-based helper. Fast, friendly, reliable.");
  72 |   await page.getByLabel("Skills").fill("Cleaning, moving, errands");
  73 |   await page.getByRole("button", { name: "Save" }).click();
  74 |   await expect(page.getByText("Saved")).toBeVisible();
  75 |   await page.screenshot({ path: path.join(screenshotRoot, "06-profile-saved.png"), fullPage: true });
  76 | });
  77 | 
  78 | 
```