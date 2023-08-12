const { getNumber } = require("./GetandAddNumber/getNumber.js");
const { StartingSMS } = require("./GetandAddSMS/StartingSms.js");
const getNumbers = new getNumber();
const getSMS = new StartingSMS();

class startGettingNumSms {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async clickAddButton(page) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const accountSeetingbtn =
        "#settings > div.css-5d5ho6 > div.css-bdqskz.ncss-headline-lg-brand.ncss-col-sm-12.ncss-col-lg-4.pb8-sm.pr6-lg.pl0-sm.va-sm-t > div:nth-child(1) > div";
      await page.waitForSelector(accountSeetingbtn);
      await page.click(accountSeetingbtn, { force: true });
      const addButtonSelector = 'button[aria-label="Add Mobile Number"]';
      await page.waitForSelector(addButtonSelector);
      await page.click(addButtonSelector);
    } catch (error) {
      console.log("Error clicking or adding button: " + error);
      await page.evaluate(() => {
        location.reload();
      });
      return this.clickAddButton(page); // Rethrow the error to be caught by the caller
    }
  }
  async startingFunctions(page, email) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      await this.delay(5000);
      await this.clickAddButton(page);
      const numberObject = await getNumbers.gettingPhoneNumber(page);
      await this.delay(4000);
      await getSMS.gettingSMSCode(page, numberObject, email);
    } catch (error) {
      console.log("Error in handleSmsProcess: " + error);
      return this.startingFunctions(page, email);
      // Instead of recursive call, consider using retry logic with a maximum number of retries
    }
  }
}
module.exports = {
  startGettingNumSms,
};
