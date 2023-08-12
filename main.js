const {
  solve_shared,
  solve_task,
} = require("./controllers/antiBotsSolving/KasadaByPass.js");
const readline = require("readline");
const fs = require("fs");
const { getPassword } = require("./helpers/generatePassword.js");
const generateRandomEmail = require("./helpers/generateNameEmail.js");
const getProxies = () => {
  const proxies = fs
    .readFileSync("proxies.txt", "utf8")
    .split("\n")
    .map((proxy) => proxy.trim());
  return proxies.filter((proxy) => proxy !== ""); // filter out any empty lines
};

function createNumberGenerator() {
  let counter = 0;

  return function () {
    counter++;
    return counter;
  };
}

async function main() {
  const generateNumber = createNumberGenerator();
  const proxies = getProxies();
  let proxyIndex = 0;

  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askForAccounts = () => {
      return new Promise((resolve) => {
        rl.question(
          "Enter the number of accounts you need (1 to 100): ",
          (answer) => {
            const accounts = parseInt(answer);
            if (isNaN(accounts) || accounts < 1 || accounts > 100) {
              console.log(
                "Invalid number. Please enter a number between 1 and 100."
              );
              resolve(askForAccounts());
            } else {
              resolve(accounts);
            }
          }
        );
      });
    };

    const askForTasks = () => {
      return new Promise((resolve) => {
        rl.question(
          "Enter the number of tasks you want to generate and solve (1 to 6): ",
          (answer) => {
            const tasks = parseInt(answer);
            if (isNaN(tasks) || tasks < 1 || tasks > 6) {
              console.log(
                "Invalid number. Please enter a number between 1 and 6."
              );
              resolve(askForTasks());
            } else {
              resolve(tasks);
            }
          }
        );
      });
    };

    const accounts = await askForAccounts();
    const tasks = await askForTasks();
    rl.close(); // Close the readline interface

    for (let i = 0; i < accounts; i += tasks) {
      const promises = [];
      for (let j = 0; j < tasks && i + j < accounts; j++) {
        const randomEmailDetails = generateRandomEmail();
        const emailAccount = randomEmailDetails.email;
        const randomFirstName = randomEmailDetails.randomFirstName;
        const randomLastName = randomEmailDetails.randomLastName;
        const passwordAccount = await getPassword();

        const email = `testing${generateNumber()}@gmail.com`;
        console.log(email);
        const proxy = proxies[proxyIndex % proxies.length];
        proxyIndex++;
        // console.log("proxy", proxy);
        promises.push(
          solve_task(
            email,
            emailAccount,
            passwordAccount,
            j,
            randomFirstName,
            randomLastName
          )
        );
      }
      await Promise.all(promises);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 second between batches
    }
  } catch (error) {
    console.error("Error running main:", error);
    return main();
  }
}

main();
module.exports = { main };
