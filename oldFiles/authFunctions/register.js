const {
  getRandomDate,
  formatDate,
} = require("../../../helpers/generateDate.js");
const fs = require("fs");
const {
  fillSettingProfile,
} = require("../../../controllers/addPhoneNumber.js");
const {
  fetchVerificationCodeFromEmail,
} = require("../../../helpers/VerificationEmail.js");
const { waitForAndClick } = require("../../../clickMoves/clickButtons.js");
const { humanType } = require("../../../clickMoves/humanType.js");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function enterVerificationCode(page, email) {
  try {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
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
  } catch (error) {
    console.log("error in fetching code of email " + error);
    const inputField = await page.$('[name="verificationCode"]');
    await inputField.click({ clickCount: 3 }); // Select all text in the input field
    await inputField.press("Backspace");
    return enterVerificationCode(page, email);
  }
}
async function enteringProfileData(
  page,
  passwordValue,
  randomFirstName,
  randomLastName
) {
  try {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    const inputSelectorfirstName = "#l7r-first-name-input";
    const textToTypeName = randomFirstName; // Replace with the text you want to type
    await humanType(page, inputSelectorfirstName, textToTypeName);
    await delay(3000);
    const inputSelectorlastName = "#l7r-last-name-input";
    const textToTypeLastName = randomLastName; // Replace with the text you want to type
    await humanType(page, inputSelectorlastName, textToTypeLastName);
    await delay(3000);
    const passwordInputSelector = "#l7r-password-input"; // Replace with the appropriate selector for the Password input field
    await humanType(page, passwordInputSelector, passwordValue);
    await delay(3200);
    const selectElementSelector = "#l7r-shopping-preference"; // Replace with the appropriate selector for the select element
    await page.waitForSelector(selectElementSelector);
    const optionValueToSelect = "MENS"; // Value of the "Men's" option
    await page.select(selectElementSelector, optionValueToSelect);
    await delay(3100);
    const dateOfBirthInputSelector = "#l7r-date-of-birth-input";
    const startDate = new Date("1985-01-01");
    const endDate = new Date("2003-01-01");
    const randomDate = getRandomDate(startDate, endDate);
    const formattedDate = await formatDate(randomDate);
    await humanType(page, dateOfBirthInputSelector, formattedDate);
    await delay(3100);
    const checkboxSelector = "#privacyTerms"; // Replace with the appropriate selector for the checkbox
    waitForAndClick(page, checkboxSelector);
    await delay(3000);
    return formattedDate;
  } catch (error) {
    console.log("inputs Regitser error : ", error);
    await page.evaluate(() => {
      document.querySelector("#l7r-first-name-input").value = "";
      document.querySelector("#l7r-last-name-input").value = "";
      document.querySelector("#l7r-password-input").value = "";
      document.querySelector("#l7r-date-of-birth-input").value = "";
      document.querySelector("#privacyTerms").checked = false;
    });

    await enteringProfileData(
      page,
      passwordValue,
      randomFirstName,
      randomLastName
    );
  }
}
async function addinfAccountTOFileJson(
  email,
  passwordValue,
  randomFirstName,
  randomLastName,
  optionValueToSelect,
  formattedDate
) {
  try {
    const profilesFile = "profiles.json";
    if (!fs.existsSync(profilesFile)) {
      fs.writeFileSync(profilesFile, JSON.stringify({}));
    }

    // Read the existing data from profiles.json
    const profilesData = JSON.parse(fs.readFileSync(profilesFile));
    const id = new Date().getTime();
    // Create a new profile object with the email and password
    const newProfile = {
      email: email,
      password: passwordValue,
      name: randomFirstName + " " + randomLastName,
      shoppingPreference: optionValueToSelect,
      dateOfBirth: formattedDate,
      privacyTermsAgreed: true,
      createdAt: new Date(),
    };

    // Add the new profile using email as the key
    profilesData[id] = newProfile;

    // Write the updated data back to profiles.json
    fs.writeFileSync(profilesFile, JSON.stringify(profilesData));
    console.log("Profile added to profiles.json");

    await delay(3000);
  } catch (error) {
    console.error("Error handling profiles.json:", error);
    // If the maximum number of retries is reached, close the page
    await addinfAccountTOFileJson(
      email,
      passwordValue,
      randomFirstName,
      randomLastName,
      optionValueToSelect,
      formattedDate
    );
  }
}

async function register(
  page,
  email,
  passwordValue,
  randomFirstName,
  randomLastName
) {
  const optionValueToSelect = "MENS"; // Value of the "Men's" option
  try {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    await enterVerificationCode(page, email);
    await delay(3000);
    const formattedDate = await enteringProfileData(
      page,
      passwordValue,
      randomFirstName,
      randomLastName
    );
    await delay(3000);

    const buttonSelector = 'button[aria-label="Create Account"]'; // Replace with the appropriate selector for the button
    await page.waitForSelector(buttonSelector);
    await addinfAccountTOFileJson(
      email,
      passwordValue,
      randomFirstName,
      randomLastName,
      optionValueToSelect,
      formattedDate
    );
    await page.waitForSelector(buttonSelector);
    await delay(3000);
    await page.click(buttonSelector);
    console.log("clicked button");
    console.log("Registration successful"); // Log success
  } catch (error) {
    console.log("All register function error : " + error);
    console.log("Retrying registration...");
    await register(page, email, passwordValue, randomFirstName, randomLastName);
  }
}

module.exports = {
  register,
};
