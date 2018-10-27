## mp-converter



## 介绍

mp-converter 是一个小程序语法转换器，可以在微信，百度，支付宝小程序之间互相转换，免去手动改文件后缀以及命名空间的烦恼。



## 安装

npm install mp-converter -g



## 使用

```console
cd myproject
mpc build [options]
```



### options

| 可选参数 | 可选参数全称   | 值                             |
| ---- | -------- | ----------------------------- |
| --t  | --target | 目标小程序，可选值'wx', 'baidu', 'ant' |
| --f  | --from   | 原程小程序，可选值'wx', 'baidu', 'ant' |
| --o  | --output | 删除文件夹                         |

mp-converter会优先使用命令行参数，如果没有则会在项目根目录下面寻找mpc.config.js配置文件，mpc.config.js写法如下：

```console
exports = module.exports = {
	from: 'wx', 
	target: 'swan',
	output: 'D:/tempTest'
}
```



### License 

MIT