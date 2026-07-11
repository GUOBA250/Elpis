const path = require('path');
const glob = require('glob');
const { sep } = path
/**
 * service loader
 * @param {object} app Koa 实例
 * 
 * 加载所有 service， 可通过app.service.${目录}.${文件} 访问
 * 例子：
 * app/service/custom-module/custom-service.js 
 * => app.service.customModule.customService
 */
module.exports = (app) => {
    // 读取 app/service/**/*.js  下所有的文件
    const servicePath = path.resolve(app.businessPath, 'service');
    const fileList = glob.sync(path.resolve(servicePath, `**${sep}*.js`));


    //遍历所有文件目录，把内容加载到app.services 下
    const services = {};
    fileList.forEach(file => {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径
        name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf(`.`));

        // 把 ‘-’ 统一改成驼峰式
        name = name.replace(/-/g, (match) => match.toUpperCase());

        // 挂载 service 到内存 app 对象中
        let tempService = services
        const names = name.split(sep)
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ServiceModule = require(path.resolve(file))(app);
                tempService[names[i]] = new ServiceModule();
            } else {
                if (!tempService[names[i]]) {
                    tempService[names[i]] = {}
                }

                tempService = tempService[names[i]]
            }
        }
    })
    app.services = services;
}

