const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Read JSON data from the file
fs.readFile("profiles.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const json_data = JSON.parse(data);

  const datas = Object.values(json_data);

  // Format the data and add spaces
  const formattedData = datas
    .map((record) => {
      return Object.entries(record)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    })
    .join("\n\n"); // Add an extra line break between records

  // Write formatted data to a text file
  fs.writeFile("formatted_profiles.txt", formattedData, (err) => {
    if (err) {
      console.error("Error writing formatted data:", err);
    } else {
      console.log("Formatted data has been written successfully.");
    }
  });
});
