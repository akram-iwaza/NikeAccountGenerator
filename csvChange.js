const fs = require("fs");
const { Parser } = require("json2csv");

// Load JSON data from a file
const jsonData = require("./profiles.json"); // Replace with your JSON file's path

// Define the fields you want to include in the CSV
fs.readFile("profiles.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const json_data = JSON.parse(data);

  const datas = Object.values(json_data);
  // Create a CSV parser instance
  const json2csvParser = new Parser(datas);

  // Convert JSON to CSV format
  const csvData = json2csvParser.parse(jsonData);

  // Write the CSV data to a file
  fs.writeFileSync("output.csv", csvData);
});
