const path = require('path');
const glob = require('glob');
const { sep } = path
/**
 * controller loader
 * @param {object} app Koa 实例
 * 
 * 加载所有 controller， 可通过app.controller.${目录}.${文件} 访问
 * 例子：
 * app/controller/custom-module/custom-controller.js 
 * => app.controller.customModule.customController
 */
module.exports = (app) => {
    // 读取 app/controller/**/*.js  下所有的文件
    const controllerPath = path.resolve(app.businessPath, 'controller');
    const fileList = glob.sync(path.resolve(controllerPath, `**${sep}*.js`));


    //遍历所有文件目录，把内容加载到app.controller 下
    const controller = {};
    fileList.forEach(file => {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf(`.`));

        // 把 ‘-’ 统一改成驼峰式
        name = name.replace(/-/g, (match) => match.toUpperCase());

        // 挂载 controller 到内存 app 对象中
        let tempController = controller
        const names = name.split(sep) //[customModule, customController]
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ControllerModule = require(path.resolve(file))(app);
                tempController[names[i]] = new ControllerModule();
            } else {
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {}
                }

                tempController = tempController[names[i]]
            }
        }
    })
    app.controllers = controller;
}

