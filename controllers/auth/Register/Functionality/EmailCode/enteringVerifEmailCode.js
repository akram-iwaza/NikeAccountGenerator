const { humanType } = require("../../../../../clickMoves/humanType.js");
const { getCodeEmail } = require("./GetiingVerifCode.js");

const getCode = new getCodeEmail();

class VerifcationCodeEmail {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async enterVerificationCode(page, email) {
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      const verifCode = '[name="verificationCode"]';
      await page.waitForSelector(verifCode);
      await this.delay(4000);
      const verificationCode = await getCode.fetchVerificationCodeFromEmail(
        email
      );
      if (verificationCode !== null) {
        console.log(`Email: ${email}, Verification Code: ${verificationCode}`);
        await humanType(page, verifCode, verificationCode);
        return;
      } else {
        console.log(`Email: ${email}, No Verification Code sent`);
      }
    } catch (error) {
      console.log("error in fetching code of email " + error);
      // const inputField = await page.$('[name="verificationCode"]');
      // await inputField.click({ clickCount: 3 }); // Select all text in the input field
      // await inputField.press("Backspace");
      return this.enterVerificationCode(page, email);
    }
  }
}
module.exports = {
  VerifcationCodeEmail,
};
