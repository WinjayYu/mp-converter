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
        let {from, target, output} = this.options;

        if (!from || !target || !output) {
            let mpcConf = {};
            try {
                mpcConf = utils.getConfig();
            } catch (e) {

            }
            from = from || mpcConf.from || 'wx';
            target = target || mpcConf.target || 'baidu';
            output = output || mpcConf.output || currentDir + path.sep + 'dist';
        }

        cache.setOriginMptype(from);
        cache.setTargetMpType(target);
        cache.setOutputDir(output); //默认路径

        this.files = utils.getFiles();
        this.files.forEach((file) => {
            let opath = path.parse(path.join(currentDir, file));
            if (file) {
                this.compile(opath);
            }
        });
    }

    compile(opath) {
        let filePath = path.join(opath.dir, opath.base);
        let targetPath = path.normalize(cache.getOutputDir() + filePath.replace(currentDir, ''));

        let outInfo = { filePath, targetPath };
        switch (opath.ext) {
            case '.js':
                this.compileJs(outInfo);
                break;
            case '.json':
                this.compileJson(outInfo);
                break;
            case '.wxss':
            case '.css':
            case '.acss':
                this.compileCss(outInfo);
                break;
            case '.wxml':
            case '.axml':
            case '.swan':
                this.compileXml(outInfo);
                break;
        }
    }

    compileJs(outInfo) {
        let from = cache.getOriginMptype();
        let originNamespace = utils.getNamespace(from);

        let target = cache.getTargetMpType();
        let targetNamespace = utils.getNamespace(target);

        let { filePath, targetPath } = outInfo;
        console.log('读取 ' + filePath);
        let code = fs.readFileSync(filePath, 'utf8');
        code = code.replace(new RegExp('\\b' + originNamespace + '\\b', 'g'), targetNamespace);
        console.log('写入 ' + targetPath);
        mkdirp.sync(getDirName(targetPath));
        fs.writeFileSync(targetPath, code, 'utf8');
    }

    compileJson(outInfo) {
        let { filePath, targetPath } = outInfo;
        console.log('读取 ' + filePath);
        let code = fs.readFileSync(filePath, 'utf8');
        console.log('写入 ' + targetPath);
        mkdirp.sync(getDirName(targetPath));
        fs.writeFileSync(targetPath, code, 'utf8');
    }

    compileCss(outInfo) {
        let target = cache.getTargetMpType();
        let targetNameSuffix = utils.getCssSuffix(target)

        let { filePath, targetPath } = outInfo;
        targetPath = targetPath.replace(new RegExp(path.extname(filePath)), targetNameSuffix);
        console.log('读取 ' + filePath);
        let code = fs.readFileSync(filePath, 'utf8');
        console.log('写入 ' + targetPath);
        mkdirp.sync(getDirName(targetPath));
        fs.writeFileSync(targetPath, code, 'utf8');
    }

    compileXml(outInfo) {
        let from = cache.getOriginMptype();
        let originNamespace = utils.getNamespace(from);
        let target = cache.getTargetMpType();
        let targetNamespace = utils.getNamespace(target);
        let targetNameSuffix = utils.getNamespace(target);

        let { filePath, targetPath } = outInfo;
        targetPath = targetPath.replace(new RegExp(path.extname(filePath)), targetNameSuffix);

        console.log('读取 ' + filePath);
        let code = fs.readFileSync(filePath, 'utf8');
        code = code.replace(new RegExp(originNamespace, 'g'), targetNamespace);
        console.log('写入 ' + targetPath);
        mkdirp.sync(getDirName(targetPath));
        fs.writeFileSync(targetPath, code, 'utf8');
    }

}
