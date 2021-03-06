#! /usr/bin/env node
const program = require("commander");
const path = require("path");
const { version } = require("./const");
const commandMap = require("./commandMap");

// 添加自定义指令
Reflect.ownKeys(commandMap).forEach((key) => {
  const value = commandMap[key];
  program
    .command(key) // 指令名称
    .alias(value.alias) // 指令简写
    .description(value.description) // 指令描述
    .action(() => {
      // 指令具体的操作
      if (key === "*") {
        console.log("指令不存在");
      } else {
        // 处理不同的指令
        require(path.resolve(__dirname, key))(...process.argv.slice(3));
      }
    });
});

// 完善 --help 指令提示
program.on("--help", () => {
  console.log("Example:");
  Reflect.ownKeys(commandMap).forEach((key) => {
    const value = commandMap[key];
    console.log(`  ${value.example}  `);
  });
});

// 实现 --version 和 --help
program.version(version).parse(process.argv);
