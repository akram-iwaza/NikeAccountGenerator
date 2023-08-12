const fs = require("fs");
const { SMSActivate, SMSNumber } = require("sms-activate-org");
const api = new SMSActivate("A4db5f58c708Ac1A9150c54ed9d96806");
const { waitForAndClick } = require("../HumanBehavior/clickButtons.js");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function addingPhoneNumber(page, phoneNumber) {
  try {
    const phoneNumberSelector = "#phoneNumber";
    await page.waitForSelector(phoneNumberSelector);
    await delay(3000);
    await page.focus(phoneNumberSelector);
    await page.keyboard.type(phoneNumber, { delay: 550 });
  } catch (error) {
    console.log("error enter phone number :" + error);
    await delay(2000);
    const inputField = await page.$("#phoneNumber");
    await inputField.click({ clickCount: 3 }); // Select all text in the input field
    await inputField.press("Backspace"); // Delete the selected text
    return addingPhoneNumber();
  }
}
async function addingSMSCode(page, smsCodeNumber) {
  try {
    let startTime = Date.now();
    while (smsCodeNumber === null && Date.now() - startTime < 20000) {
      await delay(1000); // Wait for 1 second before checking again
    }

    if (smsCodeNumber === null) {
      console.log("smsCodeNumber is null, retrying the function.");
      const selectorClostBtn = 'button[aria-label="Close Dialog"]';

      await waitForAndClick(page, selectorClostBtn);

      await delay(2000);
      return addingSMSCode(page); // Recursive call to retry the function
    }
    console.log("smsCodeNumber : ", smsCodeNumber);
    const selectorCode =
      'input[type="number"][name="code"].nds-input-text-field.css-1vpt1v7.e1fiih290';
    await page.waitForSelector(selectorCode);
    await page.keyboard.type(selectorCode, smsCodeNumber, { delay: 400 });
  } catch (error) {
    console.log("error enter sms : " + error);
    return addingSMSCode(page, smsCodeNumber);
  }
}
async function savingDataToProfiles(phoneNumber) {
  try {
    const profilesDataPhone = fs.readFileSync("profiles.json", "utf8");
    const profilesPhone = JSON.parse(profilesDataPhone);

    // Checking if emailSender exists
    for (let id in profilesPhone) {
      if (profilesPhone[id].email === email) {
        // If exists, add phoneNumber
        profilesPhone[id].phoneNumber = "+1" + phoneNumber;
        console.log(`${phoneNumber} is added for email ${email}`);
      }
    }

    fs.writeFileSync(
      "profiles.json",
      JSON.stringify(profilesPhone, null, 2),
      "utf8"
    );
  } catch (error) {}
}
async function handleSmsProcess(page, email) {
  try {
    let smsCodeNumber = null;
    let phoneNumber;
    const addButtonSelector =
      "#settings > div.css-5d5ho6 > div.css-1sacv8c.ncss-col-lg-4.pt9-lg.pb12-lg.va-sm-t > div:nth-child(2) > div > form > div.account-form > div.mex-mobile-input-wrapper.ncss-col-sm-12.ncss-col-md-12.pl0-sm.pr0-sm.pb3-sm > div > div > div > div.ncss-col-sm-6.ta-sm-r.va-sm-m.flx-jc-sm-fe.d-sm-iflx > button";

    await waitForAndClick(page, addButtonSelector);

    try {
      const number = await api.getNumber({ service: "Nike", country: "USA" });

      try {
        await number.ready();
        const numberWithoutCode = number.phoneNumber.slice(1);
        phoneNumber = numberWithoutCode;

        // Press the "send sms" button, wait for 180s to catch the code
        try {
          const code = await number.getCode(180);
          await number.success();
          smsCodeNumber = code;
          console.log("CodeSMSAPI :", code);
        } catch (err) {
          console.error("Error getting code:", err);
          number.failed();
        }
      } catch (err) {
        console.error("Error processing number:", err);
        number.failed();
      }
    } catch (err) {
      console.error("Error getting number:", err);
    }

    await addingPhoneNumber(page, phoneNumber);

    await delay(2600);
    const checkboxSelector = "#agreeToTerms";
    // await page.waitForSelector(checkboxSelector);
    // await page.click(checkboxSelector);
    await waitForAndClick(page, checkboxSelector);

    const sendCodeButtonSelector =
      "#modal-root > div > div > div > div > div > section > div > div.css-we8bvk.e4rebre0 > form > div.d-sm-flx.flx-jc-sm-fe.mt6-sm > button";
    // await page.waitForSelector(sendCodeButtonSelector);
    // await page.click(sendCodeButtonSelector);
    await waitForAndClick(page, sendCodeButtonSelector);

    console.log("delay to get sms code");

    await addingSMSCode(page, smsCodeNumber);

    const selector = '[data-testid="done-button"]';
    await delay(3000);
    await waitForAndClick(page, selector);

    await delay(2000);
    await savingDataToProfiles(phoneNumber);
  } catch (error) {
    console.log("error in handleSmsProcess : ", error);
    await page.reload();
    await page.waitForNavigation();
    return handleSmsProcess(page); // Recursive call to retry the function
  }
}

async function fillSettingProfile(page) {
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
    }
    // var phoneNumber;
    // var smsCodeNumber;

    await delay(3000);

    const userNameButton =
      "#root > div > div.root-controller.remove-outline > div.main-layout > div > header > div.d-sm-h.d-lg-b > section > div > ul > li.member-nav-item.d-sm-ib.va-sm-m > div > div > button > div";
    await page.waitForSelector(userNameButton);
    await page.hover(userNameButton);
    // Wait a bit to simulate user behaviour
    await delay(1000);
    await page.click(userNameButton);
    await delay(3000);
    const settingsBtn =
      "#root > div > div.root-controller.remove-outline > div.main-layout > div > header > div.d-sm-h.d-lg-b > section > div > ul > li.member-nav-item.d-sm-ib.va-sm-m > div > div > ul > li:nth-child(1)";
    await page.waitForSelector(settingsBtn);
    await page.click(settingsBtn);

    await delay(4000);
    await handleSmsProcess(page, email);
  } catch (error) {
    console.error(`Error during form filling: ${error}`);
  }
}
module.exports = {
  fillSettingProfile,
};
// try {
//   const balance = await api.getBalance();
//   console.log(`My balance is ${balance}`);
//   api
//     .getNumber({ service: "Nike", country: "USA" })
//     .then(async (number) => {
//       try {
//         console.log(number, "log numbers");

//         await number.ready();
//         const numberWithoutCode = number.phoneNumber.slice(1);
//         phoneNumber = numberWithoutCode;

//         try {
//           const code = await number.getCode(25);
//           await number.success();
//           smsCodeNumber = code;
//           console.log("CodeSMSAPI : ", code);
//         } catch (err) {
//           console.error(err);
//           number.failed();
//         }
//       } catch (err) {
//         console.error(err);
//         number.failed();
//       }
//     });
// } catch (error) {}
