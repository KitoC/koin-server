const fs = require("fs");
const path = require("path");

const autoLoader = (dirname) => {
  const files = {};

  fs.readdirSync(dirname).forEach((fileName) => {
    const shouldLoadFile = fileName !== "index.js" && fileName.includes(".js");
    const shouldLoadDir = fileName !== "index.js" && fileName !== "__tests__";

    const filePath = path.join(dirname, fileName);

    if (shouldLoadFile) {
      files[fileName.replace(".js", "")] = require(filePath);
    } else if (shouldLoadDir) {
      files[fileName] = autoLoader(filePath);
    }
  });

  return files;
};

module.exports = autoLoader;
