const download = require('download-git-repo')
const exec = require('child_process').exec
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')

  // 方法一 测试ok
  return new Promise((resolve, reject) => {
    // const spinner = ora('loading').start();
    let cmdStr = `git clone https://github.com/117653599/vue-template.git ${target} && cd ${target} && git checkout master`
    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        // spinner.fail('失败');
        reject(error)
        // process.exit()
      } else {
        // spinner.succeed('成功!'); 
        resolve(target)
      }
      // console.log(`\n cd ${projectName} && npm install\n`)
      // process.exit()
    })
  });

  // 方法二 dowload-git-repo还不OK
  // return new Promise((resolve, reject) => {
  //   download('https://github.com/vuejs-templates/webpack.git', target, { clone: true }, err => {
  //     if (err) {
  //       reject(err)
  //     } else {
  //       resolve(target)
  //     }
  //   })
  // });
}
