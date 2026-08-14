import { test, expect } from '@playwright/test';
import { assert } from 'console';
import { url } from 'inspector';

const LOGIN_URL = 'https://pw-practice-dev.playwrightvn.com/wp-admin';
const ADMIN_USERNAME = 'betterbytes.academy.admin';
const ADMIN_PASSWORD = 'StrongPass@BetterBytesAcademy';

const KHOA_HOC = "E101";
const TEN_BAN = "Dat";
const USERNAME = `${KHOA_HOC}-${TEN_BAN}`;
const EMAIL = `${KHOA_HOC}.${TEN_BAN}@hehe.com`;
const PASSWORD = "TestPass@123456";
const FIRST_NAME = KHOA_HOC;
const LAST_NAME = TEN_BAN;

test.describe('ACCOUNT - Account', () => {
    test.beforeEach('Login as admin', async ({ page }) => {
        await page.goto(LOGIN_URL);
        await page.locator("//input[@id='user_login']").fill(ADMIN_USERNAME);
        await page.locator("//input[@id='user_pass']").fill(ADMIN_PASSWORD);
        await page.locator("//input[@id='wp-submit']").click();
    });

    test.afterEach('Teardown: delete new user', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(LOGIN_URL);
            await page.locator("//input[@id='user_login']").fill(ADMIN_USERNAME);
            await page.locator("//input[@id='user_pass']").fill(ADMIN_PASSWORD);
            await page.locator("//input[@id='wp-submit']").click();
        });

        await test.step('Delete new user', async () => {
            await page.locator("//li[@id='menu-users']").click();
            await page.locator("//input[@id='user-search-input']").fill(USERNAME);
            await page.locator("//input[@id='search-submit']").click();
            await page.locator("//td[@data-colname='Name']").hover();
            await page.locator("//a[@class='submitdelete']").click();
            const isDeleteoptionVisible = await page.locator("//input[@id='delete_option0']").isVisible();
            if (isDeleteoptionVisible) {
                await page.locator("//input[@id='delete_option0']").check();
            }
            await page.locator("//input[@id='submit']").click();
        });
    });

    test('@ACC_001 Create account with editor permission', async ({ page }) => {
        await test.step('Go to user management screen', async () => {
            await page.locator("//li[@id='menu-users']").click();
        });

        await test.step('Verify Users screen', async () => {
            await expect(page.locator("//h1[normalize-space()='Users']")).toBeVisible({ timeout: 5_000 });
            await expect(page.locator("//a[@class='page-title-action']")).toBeEnabled({ timeout: 5_000 });
        });

        await test.step('Add new user with Editor role', async () => {
            await page.locator("//a[@class='page-title-action']").click();
            await page.locator("//input[@id='user_login']").fill(USERNAME);
            await page.locator("//input[@id='email']").fill(EMAIL);
            await page.locator("//input[@id='first_name']").fill(FIRST_NAME);
            await page.locator("//input[@id='last_name']").fill(LAST_NAME);
            await page.locator("//input[@id='url']").fill('https://www.facebook.com/');
            await page.locator("//input[@id='pass1']").fill(PASSWORD);
            await page.locator("//input[@id='send_user_notification']").uncheck();
            await page.locator("//select[@id='role']").selectOption('editor');
            await page.locator("//input[@id='createusersub']").click();
        });

        await test.step('Verify user created successfully', async () => {
            await expect(page.locator("//div[@id='message']")).toBeVisible({ timeout: 5_000 });
        });

        await test.step('Logout', async () => {
            await page.locator("//ul[@id='wp-admin-bar-top-secondary']").hover();
            await page.locator("//li[@id='wp-admin-bar-logout']").click();
        });

        await test.step('Verify logout success', async () => {
            await expect(page.locator("//div[@id='login-message']")).toBeVisible({ timeout: 5_000 });
        });

        await test.step('Login with new user', async () => {
            await page.locator("//input[@id='user_login']").fill(USERNAME);
            await page.locator("//input[@id='user_pass']").fill(PASSWORD);
            await page.locator("//input[@id='wp-submit']").click();
        });

        await test.step('Verify login success', async () => {
            await expect(page.locator("//h1[normalize-space()='Dashboard']")).toBeVisible();
        });

        for (const name of ['Dashboard', 'Posts', 'Media', 'Pages', 'Comments', 'Profile', 'Tools']) {
            await expect(
                page.locator("//div[@class='wp-menu-name']").filter({ hasText: name })
            ).toBeVisible({ timeout: 5_000 });
        }
        for (const name of ['Appearance', 'Users', 'Plugins']) {
            await expect(
                page.locator("//div[@class='wp-menu-name']").filter({ hasText: name })
            ).toBeHidden({ timeout: 5_000 });
        }

        await test.step('Logout', async () => {
            await page.locator("//ul[@id='wp-admin-bar-top-secondary']").hover();
            await page.locator("//li[@id='wp-admin-bar-logout']").click();
        });
    });

    test('@ACC_002 Create account with subscriber permission', async ({ page }) => {
        await test.step('Go to user management screen', async () => {
            await page.locator("//li[@id='menu-users']").click();
        });

        await test.step('Verify Users screen', async () => {
            await expect(page.locator("//h1[normalize-space()='Users']")).toBeVisible({ timeout: 5_000 });
            await expect(page.locator("//a[@class='page-title-action']")).toBeEnabled({ timeout: 5_000 });
        });

        await test.step('Add new user with Subscriber role', async () => {
            await page.locator("//a[@class='page-title-action']").click();
            await page.locator("//input[@id='user_login']").fill(USERNAME);
            await page.locator("//input[@id='email']").fill(EMAIL);
            await page.locator("//input[@id='first_name']").fill(FIRST_NAME);
            await page.locator("//input[@id='last_name']").fill(LAST_NAME);
            await page.locator("//input[@id='url']").fill('https://www.facebook.com/');
            await page.locator("//input[@id='pass1']").fill(PASSWORD);
            await page.locator("//input[@id='send_user_notification']").uncheck();
            await page.locator("//select[@id='role']").selectOption('subscriber');
            await page.locator("//input[@id='createusersub']").click();
        });

        await test.step('Verify user created successfully', async () => {
            await expect(page.locator("//div[@id='message']")).toBeVisible({ timeout: 5_000 });
        });

        await test.step('Logout', async () => {
            await page.locator("//ul[@id='wp-admin-bar-top-secondary']").hover();
            await page.locator("//li[@id='wp-admin-bar-logout']").click();
        });

        await test.step('Verify logout success', async () => {
            await expect(page.locator("//div[@id='login-message']")).toBeVisible({ timeout: 5_000 });
        });

        await test.step('Login with new user', async () => {
            await page.locator("//input[@id='user_login']").fill(USERNAME);
            await page.locator("//input[@id='user_pass']").fill(PASSWORD);
            await page.locator("//input[@id='wp-submit']").click();
        });

        await test.step('Verify login success', async () => {
            await expect(page.locator("//h1[normalize-space()='Profile']")).toBeVisible();
        });

        for (const name of ['Dashboard','Profile']) {
            await expect(
                page.locator("//div[@class='wp-menu-name']").filter({ hasText: name })
            ).toBeVisible({ timeout: 5_000 });
        }
        for (const name of ['Appearance', 'Users', 'Plugins', 'Posts', 'Media', 'Pages', 'Comments', 'Tools']) {
            await expect(
                page.locator("//div[@class='wp-menu-name']").filter({ hasText: name })
            ).toBeHidden({ timeout: 5_000 });
        }

        await test.step('Logout', async () => {
            await page.locator("//ul[@id='wp-admin-bar-top-secondary']").hover();
            await page.locator("//li[@id='wp-admin-bar-logout']").click();
        });
    });
});
