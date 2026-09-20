const glob = require("glob");
const path = require("path");
const { sep } = path;
const _ = require("lodash");

/**
 * controller loader
 * @param {Object} app Koa 实例
 * 加载所有controller，可通过’app.controller.${目录}.${文件}‘的方式访问
 * 例子:
  app/controller
  └── custom-module
      └── custom-controller.js
  访问方式: app.controller.customModule.customController
 *
 */
module.exports = (app) => {
  // 遍历所有文件
  const controller = {};

  // 读取 app/controller 目录下的所有文件
  const elpisControllerPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}controller`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`)
  );
  elpisFileList.forEach((file) => handleFile(file));

  // 读取 app/controller 目录下的所有文件
  const bussinessControllerPath = path.resolve(
    app.bussinessPath,
    `.${sep}controller`
  );
  const bussinessFileList = glob.sync(
    path.resolve(bussinessControllerPath, `.${sep}**${sep}**.js`)
  );
  bussinessFileList.forEach((file) => handleFile(file));

  function handleFile(file) {
    // 例：/Users/xxx/Documents/elpis/elpis/app/controller/modules/a/b/custom.js
    let name = path.resolve(file);
    // 截取app/controller后面的路径 => modules/a/b/custom
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(".")
    );
    // 转成驼峰格式（对每个路径段单独转换）
    name = name.split(sep).map(s => _.camelCase(s)).join(sep);

    // 挂载controller到app上
    let tempControllers = controller;
    const names = name.split(sep);
    names.forEach((n, i) => {
      if (i === names.length - 1) {
        const ControllerModule = require(path.resolve(file))(app);
        tempControllers[n] = new ControllerModule();
      } else {
        tempControllers[n] = tempControllers[n] || {};
        tempControllers = tempControllers[n];
      }
    });
  }

  app.controller = controller;
};
