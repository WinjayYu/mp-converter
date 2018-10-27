import path from 'path';
import fs from 'fs';
import cache from './cache';
const currentDir = process.cwd();

function getFiles(dir = process.cwd(), prefix = '') {
  dir = path.normalize(dir);
  if(!fs.existsSync(dir)) {
    return [];
  }
  let files = fs.readdirSync(dir);
  let rst = [];
  files.forEach((item) => {
    let filepath = dir + path.sep + item;
    let stat = fs.statSync(filepath);
    if (stat.isFile()) {
      rst.push(prefix + item);
    } else if(stat.isDirectory()){
      rst = rst.concat(getFiles(path.normalize(dir + path.sep + item),  path.normalize(prefix + item + path.sep)));
    }
  });
  return rst;
}

function getConfig() {
  let configFile = path.join(currentDir, path.sep, 'mpc.config.js');
  let config;
  if(configFile) {
    config = require(configFile);
  }
  return config;
}

export default {
  getFiles,
  getConfig
}