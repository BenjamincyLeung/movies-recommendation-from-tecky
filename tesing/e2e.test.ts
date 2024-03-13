import path from 'path';
import { Page, chromium, Browser } from 'playwright';
// import '../app';

describe('Login', () => {
    let page: Page;

    let browser: Browser;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    })

    beforeEach(async () => {
        await page.goto('http://52.207.95.145/')
      });

    it('should display "Sign in" text on title', async () => {
        const title = await page.title();

        expect(title).toContain('Sign in');
    });

    it("should successfully login", async () => {

        await page.evaluate(() => {
            const username = document.querySelector("[name=username");
            const password = document.querySelector("[name=password");

            (username as HTMLInputElement).value = "Ben";
            (password as HTMLInputElement).value = "Ben1234";

            const submitButton = document.querySelector("#sign-in-button");

            // const submitClick = submitButton?.querySelector("type=submit");

            (submitButton as HTMLInputElement).click()
        })

        await page.waitForNavigation();

        await page.screenshot({ path: path.join(__dirname, '/e2eScreenshoot/login.png') })

        const title = await page.title();

        expect(title).toContain('HOME');
 
    })

    

    afterAll(async () => {
        await browser.close();
    });


})