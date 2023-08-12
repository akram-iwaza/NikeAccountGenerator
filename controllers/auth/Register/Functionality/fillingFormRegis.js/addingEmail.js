const {
  waitForAndClick,
} = require("../../../../../clickMoves/clickButtons.js");
const { humanType } = require("../../../../../clickMoves/humanType.js");

class fillEmail {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async enterEmailAuth(page, email) {
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      await this.delay(3000);
      const buttonExists = await page.evaluate(() => {
        const button = document.querySelector("button.css-5iaamc");
        return !!button; // Returns true if the button element is found, false otherwise
      });
      if (buttonExists) {
        // Click the button
        await page.click("button.css-5iaamc");
        await page.waitForNavigation();
      }
      const usernameSelector = "#username";
      await humanType(page, usernameSelector, email);
      await this.delay(2000);
      const continueBtn = '[aria-label="continue"]';
      await waitForAndClick(page, continueBtn);
    } catch (error) {
      console.log("error in entering email : " + error);
      return this.enterEmailAuth(page, email);
    }
  }
}
module.exports = {
  fillEmail,
};
