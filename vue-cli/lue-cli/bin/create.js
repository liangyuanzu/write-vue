const axios = require("axios");
const ora = require("ora");

const getTemplateNames = async () => {
  return await axios.get("https://api.github.com/orgs/it666-com/repos");
};

module.exports = async (projectName) => {
  // 1.下载指定模板
  const spinner = ora("Loading unicorns").start("downloading template names"); // loading
  const { data } = await getTemplateNames();
  const templateNames = data.map((i) => i.name);
  spinner.succeed("download template names successfully");
  console.log(templateNames);
};
