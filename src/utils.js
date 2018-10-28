import path from 'path';
import fs from 'fs';
import cache from './cache';

const currentDir = process.cwd();

function getFiles(dir = process.cwd(), prefix = '') {
    dir = path.normalize(dir);
    if (!fs.existsSync(dir)) {
        return [];
    }
    let files = fs.readdirSync(dir);
    files = files.filter((f) => f !== 'dist');
    let rst = [];
    files.forEach((item) => {
        let filepath = dir + path.sep + item;
        let stat = fs.statSync(filepath);
        if (stat.isFile()) {
            rst.push(prefix + item);
        } else if (stat.isDirectory()) {
            rst = rst.concat(getFiles(path.normalize(dir + path.sep + item), path.normalize(prefix + item + path.sep)));
        }
    });
    return rst;
}

function getConfig() {
    let configFile = path.join(currentDir, path.sep, 'mpc.config.js');
    let config;
    if (configFile) {
        config = require(configFile);
    }
    return config;
}

function getXMLSuffix(mpType) {
    return mpType === 'wx' ? '.wxml' : mpType === 'baidu' ? '.css' : '.axml';
}

function getCssSuffix(mpType) {
    return mpType === 'wx' ? '.wxss' : mpType === 'baidu' ? '.swan' : '.acss';
}

function getCondition(mpType) {
    return mpType === 'wx' ? 'wx:' : mpType === 'baidu' ? 's-' : 'a:';
}

function getNamespace(mpType) {
    return mpType === 'wx' ? 'wx' : mpType === 'baidu' ? 'swan' : 'my';
}


export default {
    getFiles,
    getConfig,
    getXMLSuffix,
    getCssSuffix,
    getCondition,
    getNamespace
}