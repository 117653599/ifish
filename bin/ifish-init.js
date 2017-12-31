#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const latestVersion = require('latest-version')
const ora = require('ora')
const chalk = require('chalk')
const download = require('../lib/download')
const generator = require('../lib/generator')

/**
 * Usage.
 */
program
  .usage('<project-name>')
  .parse(process.argv)

const list = glob.sync('*')
const spinner = ora('loading')
let projectName = program.args[0]
let rootName = path.basename(process.cwd())
let next = undefined

if (list.length) {
  if (list.filter(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
    console.log(chalk.red(`${projectName}已经存在`))
    return
  }
  next = Promise.resolve(projectName)
} else {
  next = Promise.resolve(projectName)
}

next && go()

function go () {
  next.then(projectRoot => {
    return inquirer.prompt([
      {
        name: 'projectName',
        message: '项目名称',
        default: `${projectRoot}`
      },
      {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      },
      {
        name: 'projectDescription',
        message: '项目描述',
        default: `A project named ${projectRoot}`
      }
    ]).then(answers => {
      return {
        projectRoot,
        answers
      }
    })
  }).then(context => {
    spinner.start();
    return download(context.projectRoot).then(target => {
      return {
        src: context.projectRoot,
        target: target,
        metadata: context.answers
      }
    })
  }).then(context => {
    return generator(context.metadata, context.src, context.target)
  }).then(() => {
    spinner.succeed('成功!')
  }).catch(err => {
    console.error(err)
    spinner.fail('失败');
  })
}
