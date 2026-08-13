import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://pw-practice-dev.playwrightvn.com/wp-admin';
const USERNAME = 'betterbytes.academy.admin';
const PASSWORD = 'StrongPass@BetterBytesAcademy';

test.describe('AUTH-Authentication', () => {
  test.beforeEach('Navigate to login page', async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('@AUTH_001 Login fail', async ({ page }) => {
    await test.step('Fill username and password', async () => {
      await page.locator("//input[@type='text']").fill(PASSWORD);
      await page.locator("//input[@type='password']").fill(USERNAME);
    });

    await test.step('Click login button', async () => {
      await page.locator("//input[@type='submit']").click();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(page.locator('#login_error')).toBeVisible();
    });
  });

  test('@AUTH_002 Login success', async ({ page }) => {
    await test.step('Fill username and password', async () => {
      await page.locator("//input[@type='text']").fill(USERNAME);
      await page.locator("//input[@type='password']").fill(PASSWORD);
    });

    await test.step('Click login button', async () => {
      await page.locator("//input[@type='submit']").click();
    });

    await test.step('Verify login success - Title contains Dashboard', async () => {
      await expect(page).toHaveTitle(/.*Dashboard.*/);
    });
  });
});
