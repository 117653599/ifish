#!/usr/bin/env node

const program = require('commander') 

program.version(require('../package.json').version)
  .usage('<command> [项目名称]')
  .command('hello', '命令说明：启动hello')
  .command('init', '命令说明：创建新项目')
  .command('list', '命令说明：查看模板')
  .parse(process.argv)
