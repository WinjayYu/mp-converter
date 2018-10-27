import utils from './utils';
import path from 'path';
import cache from './cache';
import fs from 'fs';
const currentDir = process.cwd();
const getDirName = require('path').dirname;
const mkdirp = require('mkdirp');

export default class Compile {
  constructor(options) {
    this.options = options;
  }

  build() {
    let mpcConf = utils.getConfig();

    if(this.options.from) {
      cache.setOriginMptype(this.options.from);
    } else if(mpcConf.from){
      cache.setOriginMptype(mpcConf.from);
    } else {
      cache.setOriginMptype('wx'); //默认原始小程序类型微信
    }

    if(this.options.target) {
      cache.setTargetMpType(this.options.target);
    } else if(mpcConf.target){
      cache.setTargetMpType(mpcConf.target);
    } else {
      cache.setTargetMpType('baidu'); //默认目标小程序类型百度
    }

    if(this.options.output) {
      cache.setOutputDir(this.options.output);
    } else if(mpcConf.output){
      cache.setOutputDir(mpcConf.output);
    } else {
      cache.setOutputDir(currentDir + path.sep + 'dist'); //默认路径
    }

    this.files = utils.getFiles();
    this.files.forEach((file) => {
      let opath = path.parse(path.join(currentDir, file));
      if (file) {
        this.compile(opath);
      }
    });
  }

  compile(opath) {
    switch (opath.ext) {
      case '.js':
        this.compileJs(opath)
        break;
    }
  }

  compileJs(opath) {
    let from = cache.getOriginMptype();
    let originNamespace = from === 'wx' ? 'wx' : target === 'baidu' ? 'swan' : 'my';
    let target = cache.getTargetMpType();
    let targetNamespace = target === 'wx' ? 'wx' : target === 'baidu' ? 'swan' : 'my';

    let filepath = path.join(opath.dir, opath.base)
    console.log('读取 ' + filepath);
    let code = fs.readFileSync(filepath ,'utf8')
    code = code.replace(new RegExp('\\b'+ originNamespace + '\\b', 'g'), targetNamespace);
    console.log('写入 ' + filepath);
    let targetPath = path.normalize(cache.getOutputDir() + filepath.replace(currentDir, ''));
    mkdirp.sync(getDirName(targetPath));
    fs.writeFileSync(targetPath, code, 'utf8');
  }

}
