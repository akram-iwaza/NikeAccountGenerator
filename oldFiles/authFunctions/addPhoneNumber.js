const fs = require("fs");
const { SMSActivate, SMSNumber } = require("sms-activate-org");
const api = new SMSActivate("A4db5f58c708Ac1A9150c54ed9d96806");
const { waitForAndClick } = require("../clickMoves/clickButtons.js");
const { humanType } = require("../clickMoves/humanType.js");
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function enterPhoneNumber(page) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    let phoneN;
    const number = await api.getNumber({ service: "Nike", country: "USA" });
    await number.ready();
    phoneN = number.phoneNumber.slice(1);

    await typePhoneNumber(page, phoneN);
    await delay(3000);
    await agreeAndSubmit(page);

    return number;
  } catch (error) {
    console.log(error);
    return enterPhoneNumber(page);
  }
}
const typePhoneNumber = async (page, phoneNumber) => {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    const phoneNumberSelector = "#phoneNumber";
    await page.waitForSelector(phoneNumberSelector);
    console.log("phoneNumber : " + phoneNumber);
    await humanType(page, phoneNumberSelector, phoneNumber);
  } catch (error) {
    console.log("error to click on phoneNumber  " + error);
    console.log("Retring...");
    return typePhoneNumber(page, phoneNumber);
  }
};
const agreeAndSubmit = async (page) => {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    const agreeSelector = "#agreeToTerms";
    const agreeSelectors =
      "#modal-root > div > div > div > div > div > section > div > div.css-we8bvk.e4rebre0 > form > div.d-sm-flx.flx-jc-sm-fe.mt6-sm > button";
    await page.waitForSelector(agreeSelector);
    await page.click(agreeSelector);
    await delay(3000);
    await page.waitForSelector(agreeSelectors);
    await page.click(agreeSelectors);
  } catch (error) {
    console.log("error to click on agree to terms  " + error);
    console.log("Retring...");
    return agreeAndSubmit(page);
  }
};

async function getSmsFunc(numberObject) {
  const maxRetries = 3;
  let retries = 0;
  console.log("Getting SMS code from function");

  while (retries <= maxRetries) {
    const smsCodePromise = await numberObject.getCode(20);

    if (smsCodePromise !== null) {
      return smsCodePromise;
    } else {
      retries++;
      console.log(`Retrying: ${retries}`);
      await delay(4000);
    }
  }

  // If all retries are exhausted and no valid SMS code is obtained
  return null;
}
// async function smsCodeEnter(page, numberObject, email) {
//   try {
//     const smsCode = await getSmsFunc(numberObject);
//     await delay(20000);
//     if (smsCode) {
//       await numberObject.success();
//       console.log("Received SMS code: " + smsCode);
//       await enterVerificationCode(page, smsCode);
//       await delay(3000);
//       await doneButtonAction(page);
//       console.log("SMS verification successful");
//       await updateProfileWithNumber(email, numberObject.phoneNumber);
//     } else {
//       throw new Error("no sms");
//     }
//   } catch (error) {
//     console.log("Error while entering SMS code: " + error);
//     await closeDialogOnError(page);
//     await delay(2000);
//     await reloadPage(page);
//     await delay(3000);
//     await clickAddButton(page);
//     await handleSmsProcess(page, email);
//   }
// }

async function enterVerificationCode(page, smsCode) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    const selectorCode =
      'input[type="number"][name="code"].nds-input-text-field.css-1vpt1v7.e1fiih290';
    await humanType(page, selectorCode, smsCode);
  } catch (error) {
    console.log("error to click on enterVerificationCode  " + error);
    console.log("Retring...");
    return enterVerificationCode(page, smsCode);
  }

  // await page.waitForSelector(selectorCode);
  // await page.keyboard.type(selectorCode, smsCode, { delay: 400 });
}
async function closeDialogOnError(page) {
  try {
    const closeBtn = 'button[aria-label="Close Dialog"]';
    await page.waitForSelector(closeBtn);
    await page.click(closeBtn);
  } catch (error) {
    console.log("error to click on closeBtn  " + error);
    console.log("Retring...");
    return closeDialogOnError(page);
  }
}
async function doneButtonAction(page) {
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
    return doneButtonAction(page);
  }
}
async function updateProfileWithNumber(email, phoneNumber) {
  try {
    const profilesDataPhone = fs.readFileSync("profiles.json", "utf8");
    const profilesPhone = JSON.parse(profilesDataPhone);

    for (let id in profilesPhone) {
      if (profilesPhone[id].email === email) {
        profilesPhone[id].phoneNumber = "+" + phoneNumber;
        console.log(`${phoneNumber} is added for email ${email}`);
      }
    }

    fs.writeFileSync(
      "profiles.json",
      JSON.stringify(profilesPhone, null, 2),
      "utf8"
    );
  } catch (error) {
    console.log("error in updateProfileWithNumber: " + error);
    console.log("Retrying...");
    await updateProfileWithNumber(email, phoneNumber);
  }
}

async function clickAddButton(page) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  const addButtonSelector = 'button[aria-label="Add Mobile Number"]';
  try {
    await page.waitForSelector(addButtonSelector);
    await page.click(addButtonSelector);
  } catch (error) {
    console.log("Error clicking or adding button: " + error);
    await page.evaluate(() => {
      location.reload();
    });
    return clickAddButton(page); // Rethrow the error to be caught by the caller
  }
}

async function handleSmsProcess(page, email) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    await clickAddButton(page);
    const numberObject = await enterPhoneNumber(page);
    await delay(4000);
    await smsCodeEnter(page, numberObject, email);
  } catch (error) {
    console.log("Error in handleSmsProcess: " + error);
    return handleSmsProcess(page, email);
    // Instead of recursive call, consider using retry logic with a maximum number of retries
  }
}

async function smsCodeEnter(page, numberObject, email) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    const smsCode = await getSmsFunc(numberObject);
    await delay(20000);
    await numberObject.success();
    console.log("Received SMS code: " + smsCode);
    await enterVerificationCode(page, smsCode);
    await delay(3000);
    await doneButtonAction(page);
    console.log("SMS verification successful");
    await updateProfileWithNumber(email, numberObject.phoneNumber);
  } catch (error) {
    console.log("Error while entering SMS code: " + error);
    // Handle the error appropriately, possibly by rethrowing or taking specific actions
    await closeDialogOnError(page);
    await delay(2000);
    await page.evaluate(() => {
      location.reload();
    });
    await page.waitForNavigation();

    await handleSmsProcess(page, email);
  }
}

// async function reloadPage(page) {
//   try {
//     await page.reload();
//     await page.waitForNavigation();
//   } catch (error) {
//     console.log("error in reloading : " + error);
//     return reloadPage(page);
//   }
// }

// async function clickAddButton(page) {
//   try {
//     const addButtonSelector = 'button[aria-label="Add Mobile Number"]';
//     await page.waitForSelector(addButtonSelector);
//     await page.click(addButtonSelector);
//   } catch (error) {
//     console.log("Error to click or add button : " + error);
//     console.log("Retrying...");
//     await clickAddButton(page);
//   }
// }
// async function handleSmsProcess(page, email) {
//   try {
//     const numberObject = await enterPhoneNumber(page);
//     await delay(4000);
//     await smsCodeEnter(page, numberObject, email); // Assume enterSmsCode accepts phoneNumber & email as params
//   } catch (error) {
//     await handleSmsProcess(page, email); // Recursive call to retry the function
//   }
// }
async function fillSettingProfile(page) {
  console.log("started  adding  number");
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    await page.waitForSelector('span[data-qa="user-name"]');

    // Extract and log the value
    const value = await page.evaluate(() => {
      const spanElement = document.querySelector('span[data-qa="user-name"]');
      return spanElement.textContent.trim();
    });

    console.log(value);
    const profilesData = fs.readFileSync("profiles.json", "utf8");
    const profiles = JSON.parse(profilesData);

    // Find the email based on the provided name
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

    const userNameButton = 'button[aria-haspopup="true"]';
    // await page.hover(userNameButton);
    await delay(1000);
    await page.waitForSelector(userNameButton);
    await page.click(userNameButton);

    await delay(3000);

    const settingsBtn = 'a[data-qa="top-nav-settings-link"]';
    await page.waitForSelector(settingsBtn);
    await page.click(settingsBtn);
    await page.waitForNavigation();
    await delay(4000);

    await handleSmsProcess(page, email);
  } catch (error) {
    console.error(`Error during form filling: ${error}`);
    await fillSettingProfile(page);
  }
}

module.exports = {
  fillSettingProfile,
};
