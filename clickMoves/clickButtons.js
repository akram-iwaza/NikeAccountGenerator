const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForAndClickwithoutNav(page, selector) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    console.log(selector);
    const element = await page.waitForSelector(selector);
    await delay(2000);
    await element.click();
    console.log(` clicking ${selector} done`);
  } catch (error) {
    console.error(`Failed to click on ${selector}:`, error);
  }
}
async function waitForAndClick(page, selector) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    console.log(selector);
    const element = await page.waitForSelector(selector);
    await delay(2000);
    await element.click();
    await page.waitForNavigation();
    console.log(`Navigation after clicking ${selector} done`);
  } catch (error) {
    console.error(`Failed to click on ${selector}:`, error);
  }
}
module.exports = { waitForAndClick, waitForAndClickwithoutNav };
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function waitForAndClick(page, selector) {
//   if (page.isClosed()) {
//     console.log("Page is closed, doing nothing and continuing...");
//     return;
//   }

//   try {
//     console.log(selector);
//     const element = await page.waitForSelector(selector);
//     await delay(2000);
//     await element.click();
//     await page.waitForNavigation();
//     console.log(`Navigation after clicking ${selector} done`);
//   } catch (error) {
//     console.error(`Failed to click on ${selector}:`, error);
//     console.log(`Retrying to click on ${selector}.`);
//     await waitForAndClick(page, selector);
//   }
// }

// module.exports = { waitForAndClick };
