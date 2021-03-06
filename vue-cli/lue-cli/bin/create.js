const axios = require("axios");
const ora = require("ora"); // loading
const inquirer = require("inquirer"); // 实现用户交互

const getTemplateNames = async () => {
  const { data } = await axios.get("https://api.github.com/orgs/it666-com/repos");
  return data;
};

const getTemplateTags = async (name) => {
  const { data } = await axios.get(`https://api.github.com/repos/it666-com/${name}/tags`);
  return data;
};

module.exports = async (projectName) => {
  // 1.拉取所有模板名称
  const spinner = ora("Loading").start("downloading template names");
  const names = await getTemplateNames();
  const templateNames = names.map((i) => i.name);
  spinner.succeed("download template names successfully");

  // 2.选择指定模板名称
  const { currentTemplateName } = await inquirer.prompt({
    name: "currentTemplateName", // 存储当前问题回答的变量
    type: "list", // 提问的类型
    choices: templateNames, // 列表选项
    message: "请选择要使用哪个模板来创建项目", // 问题的描述
  });

  // 3.获取版本号
  spinner.start("downloading template tags");
  const tags = await getTemplateTags(currentTemplateName);
  const templateTags = tags.map((i) => i.name);
  spinner.succeed("download template tags successfully");

  // 4.选择版本
  const { currentTemplateTag } = await inquirer.prompt({
    name: "currentTemplateTag",
    type: "list",
    choices: templateTags,
    message: "请选择要使用哪个版本来创建项目",
  });
  console.log(currentTemplateName, currentTemplateTag);
};
