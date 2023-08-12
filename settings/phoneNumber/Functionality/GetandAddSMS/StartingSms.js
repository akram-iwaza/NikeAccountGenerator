const { getSMSClass } = require("./getSMS.js");
const { typingSMSCode } = require("./typeSMS.js");
const { savePhoneClass } = require("../../../../functionsFS/savePhone.js");
// const { startGettingNumSms } = require("../StartingFunctions.js");
const getSMS = new getSMSClass();
const typeSMS = new typingSMSCode();
const savePhone = new savePhoneClass();
// const startingFuncPhoneSMS = startGettingNumSms();
class StartingSMS {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async doneButtonAction(page) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const doneBtn = '[data-testid="done-button"]';
      await page.waitForSelector(doneBtn);
      await page.click(doneBtn);
    } catch (error) {
      console.log("error to click on doneBtn  " + error);
      console.log("Retring...");
      return this.doneButtonAction(page);
    }
  }
  async closeDialogOnError(page) {
    try {
      const closeBtn = 'button[aria-label="Close Dialog"]';
      await page.waitForSelector(closeBtn);
      await page.click(closeBtn);
    } catch (error) {
      console.log("error to click on closeBtn  " + error);
      console.log("Retring...");
      return this.closeDialogOnError(page);
    }
  }
  async gettingSMSCode(page, numberObject, email) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const smsCode = await getSMS.gettingSMS(numberObject);
      await this.delay(20000);
      await numberObject.success();
      console.log("Received SMS code: " + smsCode);
      await typeSMS.enterSMSCode(page, smsCode);
      await this.delay(3000);
      await this.doneButtonAction(page);
      console.log("SMS verification successful");
      await savePhone.updateProfileWithNumber(email, numberObject.phoneNumber);
    } catch (error) {
      console.log("Error while entering SMS code: " + error);
      await this.closeDialogOnError(page);
      await this.delay(2000);
      await page.evaluate(() => {
        location.reload();
      });
      await page.waitForNavigation();
      // await startingFuncPhoneSMS.startingFunctions(page, email);
    }
  }
}
module.exports = {
  StartingSMS,
};
