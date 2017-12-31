const download = require('download-git-repo')
const exec = require('child_process').exec
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')

  return new Promise((resolve, reject) => {
    let cmdStr = `git clone https://github.com/117653599/vue-template.git ${target} && cd ${target} && git checkout master`
    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(target)
      }
      console.log(`\n cd ${projectName} && npm install \n`)
    })
  });
}
