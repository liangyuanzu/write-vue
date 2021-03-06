const axios = require("axios");
const ora = require("ora"); // loading
const inquirer = require("inquirer"); // 实现用户交互

const getTemplateNames = async () => {
  return await axios.get("https://api.github.com/orgs/it666-com/repos");
};

module.exports = async (projectName) => {
  // 1.拉取所有模板名称
  const spinner = ora("Loading unicorns").start("downloading template names");
  const { data } = await getTemplateNames();
  const templateNames = data.map((i) => i.name);
  spinner.succeed("download template names successfully");
  // 2.让用户选择指定模板名称
  const { currentTemplateName } = await inquirer.prompt({
    name: "currentTemplateName", // 存储当前问题回答的变量
    type: "list", // 提问的类型
    choices: templateNames, // 列表选项
    message: "请选择要使用哪个模板来创建项目", // 问题的描述
  });
  console.log(currentTemplateName);
};
