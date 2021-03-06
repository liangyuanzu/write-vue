#! /usr/bin/env node
const program = require("commander");
const { version } = require("./const");

// 实现 --version 和 --help
program.version(version).parse(process.argv);
