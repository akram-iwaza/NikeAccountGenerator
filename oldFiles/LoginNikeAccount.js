const fs = require("fs");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function loginUserThenWarming(page, email) {
  const maxRetries = 3; // Define the maximum number of retries
  let retryCount = 0;
  try {
    const userNameButton = 'span[data-qa="user-name"]';
    await page.waitForSelector(userNameButton);
    await delay(3000);
    await page.click(userNameButton);
    await delay(2000);
    const logoutBtn = 'button[data-qa="top-nav-logout-button"]';
    await page.waitForSelector(logoutBtn);
    await delay(3000);
    await page.click(logoutBtn);
    await page.waitForNavigation();
    await delay(3000);
    const loginBtn = 'button[data-qa="top-nav-join-or-login-button"]';
    await page.waitForSelector(loginBtn);
    await delay(3000);
    await page.click(loginBtn);
    await delay(2000);
    await page.waitForSelector("#username");
    await delay(3000);
    await page.type("#username", email, {
      delay: 350,
    });
    await delay(2000);
    const ContinueBtn = '[aria-label="continue"]';
    await page.waitForSelector(ContinueBtn);
    await delay(3000);
    ContinueBtn.click();
    await delay(3000);
    const passwordInput = 'input[type="password"][name="password"]';
    await page.waitForSelector(passwordInput);

    // Type the password into the input field
    const password = "De2GOzTc"; // Replace 'your_password_here' with your actual password
    await page.type(passwordInput, password);
    await delay(3000);
    const signinBtn = 'button[aria-label="Sign In"]';
    await page.waitForSelector(signinBtn);
    await delay(2000);
    await page.click(signinBtn);
    await page.waitForNavigation();
  } catch (error) {
    console.error(`Error during form filling: ${error}`);
    if (retryCount >= maxRetries) {
      console.log("Max retries reached, closing page.");
      await page.close();
      return;
    }
    retryCount++;
  }
}
module.exports = {
  loginUserThenWarming,
};
