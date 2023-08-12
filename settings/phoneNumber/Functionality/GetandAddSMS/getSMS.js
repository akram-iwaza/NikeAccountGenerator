class getSMSClass {
  async gettingSMS(numberObject) {
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
    return null;
  }
}
module.exports = {
  getSMSClass,
};
