const {
  fillSettingProfile,
} = require("../../../controllers/addPhoneNumber.js");
const {
  fetchVerificationCodeFromEmail,
} = require("../../..//helpers/VerificationEmail.js");
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function enterVerificationCode(page, email) {
  const maxRetries = 3; // Define the maximum number of retries
  let retryCount = 0;
  try {
    const verifCode = '[name="verificationCode"]';
    await page.waitForSelector(verifCode);
    await delay(4000);
    const verificationCode = await fetchVerificationCodeFromEmail(email);
    if (verificationCode !== null) {
      console.log(`Email: ${email}, Verification Code: ${verificationCode}`);
      await humanType(page, verifCode, verificationCode);
      return;
    } else {
      console.log(`Email: ${email}, No Verification Code sent`);
    }
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
  } catch (error) {
    console.log("error in fetching code of email " + error);
    retryCount++;
    if (retryCount >= maxRetries) {
      console.log("Max retries reached, closing page.");
      await page.close();
      return;
    }

    const inputField = await page.$('[name="verificationCode"]');
    await inputField.click({ clickCount: 3 }); // Select all text in the input field
    await inputField.press("Backspace");
    return enterVerificationCode(page, email);
  }
}
async function login(page, email, passwordAccount) {
  try {
    const passCodeSelector = 'input[name="password"]';
    const element = await page.$(passCodeSelector);
    await page.waitForSelector(passCodeSelector);
    await delay(2000);
    await page.type(passCodeSelector, passwordAccount, { delay: 320 });
    await delay(3000);

    await page.waitForSelector(".css-1028qb5");
    await page.click('button[aria-label="Sign In"]');
    await page.waitForNavigation();
    await delay(10000);
    await enterVerificationCode(page, email);
    await delay(4000);
    const continueButtonSelector = 'button[aria-label="Continue"]';

    // Wait for the button to be visible and ready for interaction
    await page.waitForSelector(continueButtonSelector);

    // Click the "Continue" button
    await page.click(continueButtonSelector);
    await page.waitForNavigation();
    await delay(3000);

    await fillSettingProfile(page);
    await delay(3000);
  } catch (error) {
    console.error("Error handling profiles.json:", error);
  }
}
module.exports = {
  login,
};
// try {
//   await page.waitForSelector(".css-k4prbj", {
//     visible: true,
//     timeout: 5000,
//   }); // Wait for the alert container to become visible
//   const alertMessage = await page.$eval(".css-k4prbj", (element) =>
//     element.textContent.trim()
//   );
//   if (alertMessage === "Invalid verification code") {
//     throw new Error("Alert message content does match expected."); // Trigger the catch block
//   }
// } catch (error) {
//   console.log(
//     "Alert message is not visible or content does not match expected."
//   );
//   await page.reload();
//   await page.waitForNavigation();
//   // fillRegistrationForm(page);
// }
