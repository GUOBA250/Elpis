const glob = require("glob");
const path = require("path");
const { sep } = path;
const _ = require("lodash");

/**
 * service loader
 * @param {Object} app Koa 实例
 * 加载所有service，可通过’app.service.${目录}.${文件}‘的方式访问
 * 例子:
  app/service
  └── custom-module
      └── custom-service.js
  访问方式: app.service.customModule.customService
 *
 */
module.exports = (app) => {
  // 遍历所有文件
  const service = {};

  // 读取 elpis/app/service 目录下的所有文件
  const elpisServicePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}service`);
  const elpisFileList = glob.sync(
    path.resolve(elpisServicePath, `.${sep}**${sep}**.js`)
  );
  elpisFileList.forEach((file) => handleFile(file));

  // 读取 业务/app/service 目录下的所有文件
  const bussinessServicePath = path.resolve(
    app.bussinessPath,
    `.${sep}service`
  );
  const bussinessFileList = glob.sync(
    path.resolve(bussinessServicePath, `.${sep}**${sep}**.js`)
  );
  bussinessFileList.forEach((file) => handleFile(file));

  function handleFile(file) {
    // 例：/Users/xxx/Documents/elpis/elpis/app/service/modules/a/b/custom.js
    let name = path.resolve(file);
    // 截取app/service后面的路径 => modules/a/b/custom
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(".")
    );
    // 转成驼峰格式（对每个路径段单独转换）
    name = name.split(sep).map(s => _.camelCase(s)).join(sep);

    // 挂载service到app上
    let tempServices = service;
    const names = name.split(sep);
    names.forEach((n, i) => {
      if (i === names.length - 1) {
        const ServiceModule = require(path.resolve(file))(app);
        tempServices[n] = new ServiceModule();
      } else {
        tempServices[n] = tempServices[n] || {};
        tempServices = tempServices[n];
      }
    });
  }

  app.service = service;
};
