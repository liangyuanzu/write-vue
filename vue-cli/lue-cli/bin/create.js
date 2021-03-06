const axios = require("axios");
const ora = require("ora"); // loading
const inquirer = require("inquirer"); // 实现用户交互
let downloadGitRepo = require("download-git-repo"); // 下载 github 仓库
const { promisify } = require("util");
const path = require("path");
let ncp = require("ncp"); // 拷贝文件
const shell = require("shelljs"); // 安装依赖
const chalk = require("chalk"); // 给提示信息加上颜色
const { downloadDirPath } = require("./const");

downloadGitRepo = promisify(downloadGitRepo); // 回调函数转 promise
ncp = promisify(ncp);
const exec = promisify(shell.exec);

const getTemplateNames = async () => {
  const { data } = await axios.get("https://api.github.com/orgs/it666-com/repos");
  return data;
};

const getTemplateTags = async (name) => {
  const { data } = await axios.get(`https://api.github.com/repos/it666-com/${name}/tags`);
  return data;
};

const waitLoading = (message, fn) => async (...args) => {
  const spinner = ora(message).start();
  const data = await fn(...args);
  spinner.succeed(`${message} successfully`);
  return data;
};

const downloadTemplate = async (name, tag) => {
  let url = `it666-com/${name}`;
  if (tag) {
    url += `#${tag}`;
  }
  const destPath = `${downloadDirPath}\\${name}`;
  await downloadGitRepo(url, destPath);
  return destPath;
};

const installDependencies = async (name) => {
  shell.cd(name);
  await exec("npm install");
};

module.exports = async (projectName) => {
  const destPath = path.resolve(projectName);
  console.log(chalk.green("✨  Creating project in ") + chalk.blue(`${destPath}`));
  // 1.拉取所有模板名称
  const names = await waitLoading("downloading template names", getTemplateNames)();
  const templateNames = names.map((i) => i.name);

  // 2.选择指定模板名称
  const { currentTemplateName } = await inquirer.prompt({
    name: "currentTemplateName", // 存储当前问题回答的变量
    type: "list", // 提问的类型
    choices: templateNames, // 列表选项
    message: "请选择要使用哪个模板来创建项目", // 问题的描述
  });

  // 3.获取版本号
  const tags = await waitLoading("downloading template tags", getTemplateTags)(currentTemplateName);
  const templateTags = tags.map((i) => i.name);

  // 4.选择版本
  const { currentTemplateTag } = await inquirer.prompt({
    name: "currentTemplateTag",
    type: "list",
    choices: templateTags,
    message: "请选择要使用哪个版本来创建项目",
  });

  // 5.下载模板
  console.log(chalk.green("✨  Initializing git repository..."));
  const sourcePath = await waitLoading("downloading template", downloadTemplate)(
    currentTemplateName,
    currentTemplateTag
  );

  // 6.拷贝模板
  await waitLoading("copying template", ncp)(sourcePath, destPath);

  // 7.安装相关依赖
  console.log(chalk.green("✨  Initializing dependencies..."));
  await waitLoading("install dependencies", installDependencies)(projectName);

  // 8.显示创建成功之后的提示信息
  console.log(chalk.green(" Successfully created project ") + chalk.blue(`${projectName}.`));
  console.log(chalk.green(" Get started with the following commands: \n"));
  console.log(chalk.magenta(`$ cd ${projectName}`));
  console.log(chalk.magenta("$ npm run serve"));
};
