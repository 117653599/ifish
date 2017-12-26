// npm i async handlebars metalsmith -D
const async = require('async');
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const rm = require('rimraf').sync
const path = require('path')

module.exports = function (metadata = {}, src, dest = '.') {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .source(path.resolve(dest + '/template'))
      .metadata(metadata)
      .use(template)
      .destination(src)
      .build(function(err){
        rm(dest)
        err ? reject(err) : resolve()

      })
  });
  // return new Promise((resolve, reject) => {
  //   console.log('当前目录:', process.cwd())
  //   Metalsmith(process.cwd())
  //     .metadata(metadata)
  //     .clean(false)
  //     .source(src)
  //     .destination(dest)
  //     .use((files, metalsmith, done) => {
  //       const meta = metalsmith.metadata()
  //       console.log('meta:', meta)
  //       Object.keys(files).forEach(fileName => {
  //         const t = files[fileName].contents.toString()
  //         files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
  //       })
  //       done()
  //     }).build(err => {
  //       // rm(src)
  //       err ? reject(err) : resolve()
  //     })
  // })
}

const template = function(files, metalsmith, done){
  const keys = Object.keys(files);
  const metadata = metalsmith.metadata();

  async.each(keys, run, done);

  function run(file, done){
    const str = files[file].contents.toString();
    render(str, metadata, function(err, res){
      if (err) return done(err);
      files[file].contents = new Buffer(res);
      done();
    });
  }
}