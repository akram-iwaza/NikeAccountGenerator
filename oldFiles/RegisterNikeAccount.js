const fs = require("fs");
const { fillSettingProfile } = require("../controllers/addPhoneNumber.js");
const { getRandomDate, formatDate } = require("../helpers/generateDate.js");
const {
  fetchVerificationCodeFromEmail,
} = require("../helpers/VerificationEmail.js");
const { register } = require("./authFunctions/register.js");
const { login } = require("./authFunctions/login.js");
const { waitForAndClick } = require("../clickMoves/clickButtons.js");
const { humanType } = require("../clickMoves/humanType.js");
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enterEmailAuth(page, email) {
  try {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    await delay(3000);
    const usernameSelector = "#username";
    await humanType(page, usernameSelector, email);
    await delay(2000);
    const continueBtn = '[aria-label="continue"]';
    await waitForAndClick(page, continueBtn);
  } catch (error) {
    console.log("error in entering email : " + error);
    return enterEmailAuth(page, email);
  }
}

async function fillRegistrationForm(
  page,
  emailAccount,
  passwordAccount,
  randomFirstName,
  randomLastName
) {
  try {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    await enterEmailAuth(page, emailAccount);
    console.log("enterEmailAuth");
    const verifCodeSelectorcheck = '[name="verificationCode"]';
    const element = await page.$(verifCodeSelectorcheck);

    if (element) {
      await register(
        page,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName
      );
      await delay(5000);
      console.log("starting to add number");
      await fillSettingProfile(page);
    } else {
      await login(page, emailAccount, passwordAccount);
    }
  } catch (error) {
    console.error(`Error during form filling register main: ${error}`);
    return fillRegistrationForm(
      page,
      emailAccount,
      passwordAccount,
      randomFirstName,
      randomLastName
    );
  }
}

module.exports = {
  fillRegistrationForm,
};
