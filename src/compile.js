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
        let code = fs.readFileSync(filepath, 'utf8')
        code = code.replace(new RegExp('\\b' + originNamespace + '\\b', 'g'), targetNamespace);
        let targetPath = path.normalize(cache.getOutputDir() + filepath.replace(currentDir, ''));
        console.log('写入 ' + targetPath);
        mkdirp.sync(getDirName(targetPath));
        fs.writeFileSync(targetPath, code, 'utf8');
    }

}
