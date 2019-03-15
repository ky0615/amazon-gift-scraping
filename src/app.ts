import * as puppeteer from "puppeteer"
import { ClickOptions, Page } from "puppeteer"

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || null
const HEADLESS = (process.env.HEADLESS || "true") === "true"

const AMAZON_MAIL = process.env.AMAZON_MAIL || ""
const AMAZON_PW = process.env.AMAZON_PW || ""
const AMAZON_BUY_PRICE = process.env.AMAZON_BUY_PRICE || "100"
const AMAZON_CARD_ID = process.env.AMAZON_CARD_ID || ""
const AMAZON_CARD_NUMBER = process.env.AMAZON_CARD_NUMBER || ""

const config = {
    headless: HEADLESS,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // puppeteer内蔵のChromiumではなく、外部にインストールしたChroniumを使用する場合にパスを指定する
    executablePath: CHROMIUM_PATH,
}

const clickOption: ClickOptions = {
    delay: 100,
}

const login = async (page: Page) => {
    console.log("show amazon top page")
    await page.goto("https://www.amazon.co.jp/ref=nav_logo")

    // click the login button
    await page.waitForSelector("#nav-signin-tooltip > a").then(it => it.click(clickOption))

    // type into the email and password form
    await page.waitForSelector("#ap_email").then(it => it.type(AMAZON_MAIL))
    await page.waitForSelector("#ap_password").then(it => it.type(AMAZON_PW))

    // submit login
    await page.waitForSelector("#signInSubmit").then(it => it.click(clickOption))

    // wait for load page
    await page.waitForSelector("#twotabsearchtextbox")
}

const firstBilling = async (page: Page) => {
    // goto the amazon gift billing page
    await page.goto("https://www.amazon.co.jp/gp/gc/create/ref=gc_cac_red")
    await page.waitForSelector("#gc-asv-manual-reload-amount").then(it => it.type(AMAZON_BUY_PRICE))
    await page.waitForSelector("#form-submit-button").then(it => it.click(clickOption))

    await page.waitForSelector("#continue-top").then(it => it.click(clickOption))

    // credit card select
    console.log(`select card id: #pm_${AMAZON_CARD_ID}`)
    await page.waitForSelector(`#pm_${AMAZON_CARD_ID}`).then(it => it.click(clickOption))

    await page.waitFor(1500)
    await page.waitForSelector("#existing-credit-cards-box > div.payment-row.two-cells.payment-selected > div.top-cell > " +
                                   "div > div.a-column.a-span7 > div.spacing-left-radio-logo > div.addr-challenge.hidden > " +
                                   "div.a-input-text-wrapper.aok-float-left.a-spacing-micro.spacing-right-small > input")
        .then(it => it.type(AMAZON_CARD_NUMBER))
    await page.waitForSelector("#existing-credit-cards-box > div.payment-row.two-cells.payment-selected > div.top-cell > " +
                                   "div > div.a-column.a-span7 > div.spacing-left-radio-logo > div.addr-challenge.hidden > " +
                                   "div:nth-child(2) > span > span > input")
        .then(it => it.click(clickOption))
    console.log("final confirm page")
    await page.waitFor(3000)
    await page.waitForSelector("#continue-top").then(it => it.click(clickOption))
    await page.waitForSelector("#order-summary-box > div.a-box.a-first > div > " +
                                   "div.a-row.a-spacing-base > div > span > span > input")
        .then(it => it.click(clickOption))
    console.log("finish the billing")
}

const billing = async (page: Page) => {
    await page.goto("https://www.amazon.co.jp/gp/gc/create/ref=gc_cac_red")
    await page.waitForSelector("#gc-asv-manual-reload-amount").then(it => it.type(AMAZON_BUY_PRICE))
    await page.waitForSelector("#form-submit-button").then(it => it.click(clickOption))

    await page.waitForSelector("#continue-top").then(it => it.click(clickOption))
    await page.waitForSelector("#order-summary-box > div.a-box.a-first > div > " +
                                   "div.a-row.a-spacing-base > div > span > span > input")
        .then(it => it.click(clickOption))
    console.log("finish the billing")
}

(async () => {
    console.log("start scraping")
    const browser = await puppeteer.launch(config)
    const page = await browser.newPage()

    await login(page)

    await firstBilling(page)
    await page.waitFor(1500)

    await billing(page)
    await page.waitFor(1500)

    await billing(page)
    await page.waitFor(1500)

    await billing(page)
    await page.waitFor(1500)

})()
