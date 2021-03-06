const { version } = require("../package.json");

const currentPlatformKey = process.platform === "win32" ? "USERPROFILE" : "HOME";
const downloadDirPath = `${process.env[currentPlatformKey]}\\.lue-template`;
module.exports = {
  version,
  downloadDirPath,
};
