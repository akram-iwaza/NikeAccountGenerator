const {
  waitForAndClick,
  waitForAndClickwithoutNav,
} = require("../../clickMoves/clickButtons.js");
const fs = require("fs");
const { startGettingNumSms } = require("./Functionality/StartingFunctions.js");
const startingFuncPhoneSMS = new startGettingNumSms();

class addingNumberandCode {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async goingToSettings(page) {
    console.log("started  adding  number");
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      await page.waitForSelector('span[data-qa="user-name"]');
      const value = await page.evaluate(() => {
        const spanElement = document.querySelector('span[data-qa="user-name"]');
        return spanElement.textContent.trim();
      });
      console.log(value);
      const profilesData = fs.readFileSync("profiles.json", "utf8");
      const profiles = JSON.parse(profilesData);
      let email = null;
      for (const profileId in profiles) {
        const profile = profiles[profileId];
        if (profile.name === value) {
          email = profile.email;
          break;
        }
      }
      if (email) {
        console.log(`Email for ${value}: ${email}`);
      } else {
        console.log(`No email found for ${value}`);
        await page.close();
        throw new Error(`No email found for ${value}`);
      }

      const userNameButton = ".portrait-dropdown";
      // await waitForAndClickwithoutNav(page, userNameButton);
      await page.waitForSelector(userNameButton);
      await page.click(userNameButton);
      await this.delay(3000);
      const settingsBtn = 'a[data-qa="top-nav-settings-link"]';
      await page.waitForSelector(settingsBtn);
      await page.click(settingsBtn);
      // await waitForAndClick(page, settingsBtn);
      await startingFuncPhoneSMS.startingFunctions(page, email);
    } catch (error) {
      console.error(`Error during form filling: ${error}`);
      await this.goingToSettings(page);
    }
  }
}
module.exports = {
  addingNumberandCode,
};
