const path = require('path');
const glob = require('glob');
const { log } = require('console');
const { sep } = path
/**
 * extend loader
 * @param {object} app Koa 实例
 * 
 * 加载所有 extend， 可通过app.extend.${文件} 访问
 * 例子：
 * app/extend/custom-extend.js 
 * => app.extend.customExtend
 */
module.exports = (app) => {
    // 读取 app/extend/**.js  下所有的文件
    const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
    const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`));


    //遍历所有文件目录，把内容加载到app.extend 下
    const extend = {};
    fileList.forEach(file => {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extends${sep}`.length, name.lastIndexOf(`.`));

        // 把 ‘-’ 统一改成驼峰式 
        name = name.replace(/-/g, (match) => match.toUpperCase());

        // 过滤 app 已经存在的key
        for (const key in app) {
            if (key === name) {
                console.log(`extend ${name} 已存在`);
                return
            }
        }
        
        // 挂载 extend 到 app 上
        app[name] = require(path.resolve(file))(app);

        // 挂载 extend 到内存 app 对象中
        let tempExtend = extend
        const names = name.split(sep) //[customModule, customExtend]
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ExtendModule = require(path.resolve(file))(app);
                tempExtend[names[i]] = new ExtendModule();
            } else {
                if (!tempExtend[names[i]]) {
                    tempExtend[names[i]] = {}
                }

                tempExtend = tempExtend[names[i]]
            }
        }
    })
    app.extends = extend;
}


