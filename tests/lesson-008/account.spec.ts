import { test, expect } from '@playwright/test';
import { assert } from 'console';
import { url } from 'inspector';

const LOGIN_URL = 'https://pw-practice-dev.playwrightvn.com/wp-admin';
const ADMIN_USERNAME = 'betterbytes.academy.admin';
const ADMIN_PASSWORD = 'StrongPass@BetterBytesAcademy';

const KHOA_HOC = 'E101';
const TEN_BAN = 'Dat';
const USERNAME = `${KHOA_HOC}-${TEN_BAN}`;
const EMAIL = `${KHOA_HOC}.${TEN_BAN}@example.com`;
const PASSWORD = 'TestPass@123';
const FIRST_NAME = KHOA_HOC;
const LAST_NAME = TEN_BAN;

test.describe('ACCOUNT - Account', () => {
    test.beforeEach('Login as admin', async ({ page }) => {
        await page.goto(LOGIN_URL);
        await page.locator("//input[@type='text']").fill(ADMIN_USERNAME);
        await page.locator("//input[@type='password']").fill(ADMIN_PASSWORD);
        await page.locator("//input[@type='submit']").click();
    });

    test.afterEach('Teardown: delete new user', async ({ page }) => {
        await test.step('Logout', async () => {
            await page.locator("//*[@id='wp-admin-bar-my-account']/a").click();
            await page.locator("//*[@id='wp-admin-bar-logout']/a").click();
        });

        await test.step('Login as admin', async () => {
            await page.goto(LOGIN_URL);
            await page.locator("//input[@type='text']").fill(ADMIN_USERNAME);
            await page.locator("//input[@type='password']").fill(ADMIN_PASSWORD);
            await page.locator("//input[@type='submit']").click();
        });

        await test.step('Delete new user', async () => {
            await page.locator("//*[@id='wp-menu-name']").getByText('Users').click();
            await page.locator("//input[@id='user-search-input']").fill(USERNAME);
            await page.locator("//input[@id='search-submit']").click();
            await page.locator("//a[@class='submitdelete']").click();
            await page.locator("//a[normalize-space()='Confirm Deletion']").click();
        });
    });

    test('@ACC_001 Create account with editor permission', async ({ page }) => {
        await test.step('Go to user management screen', async () => {
            await page.locator("//*[@id='menu-users']").click();
        });

        await test.step('Verify Users screen', async () => {
            await expect(page.locator("//h1[normalize-space()='Users']")).toBeVisible();
        });

        await test.step('Add new user with Editor role', async () => {
            await page.locator("//a[@class='page-title-action']").click();
            await page.locator("//input[@id='user_login']").fill(USERNAME);
            await page.locator("//input[@id='email']").fill(EMAIL);
            await page.locator("//input[@id='first_name']").fill(FIRST_NAME);
            await page.locator("//input[@id='last_name']").fill(LAST_NAME);
            await page.locator("//input[@id='url']").fill('https://www.facebook.com/');
            await page.locator("//input[@id='pass1']").fill(PASSWORD);
            await page.locator("//input[@id='role']").check();
            await page.locator("//select[@id='role']").selectOption('editor');
            await page.locator("//*[@id='createusersub']").click();
        });

        await test.step('Verify user created successfully', async () => {
            assert(page.url() === 'https://pw-practice-dev.playwrightvn.com/wp-admin/users.php');
        });

        await test.step('Logout', async () => {
            await page.locator("//*[@id='wp-admin-bar-my-account']/a").click();
            await page.locator("//*[@id='wp-admin-bar-logout']/a").click();
        });

        await test.step('Verify logout success', async () => {
            assert(page.url() === 'https://pw-practice-dev.playwrightvn.com/wp-login.php');
        });

        await test.step('Login with new user', async () => {
            await page.locator("//input[@type='text']").fill(USERNAME);
            await page.locator("//input[@type='password']").fill(PASSWORD);
            await page.locator("//input[@type='submit']").click();
        });

        await test.step('Verify login success', async () => {
            assert(page.url() === 'https://pw-practice-dev.playwrightvn.com/wp-admin/');
        });

        await test.step('Verify visible menus for Editor', async () => {
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Dashboard')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Posts')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Media')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Pages')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Comments')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Profile')).toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Tools')).toBeVisible();

            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Appearance')).not.toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Users')).not.toBeVisible();
            await expect(page.locator("//*[@class='wp-menu-name']").getByText('Plugins')).not.toBeVisible();
        });
    });
});
