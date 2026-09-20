const glob = require("glob");
const path = require("path");
const { sep } = path;

/**
 * router-schema loader
 * @param {Object} app Koa 实例
 * 通过 ‘json-scheam & ajv’ 对API规则进行约束，配合 api-params-verify 中间件使用
 *
 * app/router-schema/**.js

  输出：
  app.routerSchema = {
    [api1]: jsonSchema1,
    [api2]: jsonSchema2,
    ...
  }
 *
 */
module.exports = (app) => {
  // 注册所有 routerSchema，使得可以通过 app.routerSchema 访问
  let routerSchema = {};

  // 读取 elpis/app/router-shema 目录下的所有文件
  const elpisRouterSchemaPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}router-schema`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisRouterSchemaPath, `.${sep}**${sep}**.js`)
  );
  elpisFileList.forEach((file) => handleFile(file));

  // 读取 业务/app/router-shema 目录下的所有文件
  const bussinessRouterSchemaPath = path.resolve(
    app.bussinessPath,
    `.${sep}router-schema`
  );
  const bussinessFileList = glob.sync(
    path.resolve(bussinessRouterSchemaPath, `.${sep}**${sep}**.js`)
  );
  bussinessFileList.forEach((file) => handleFile(file));

  function handleFile(file) {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  }

  app.routerSchema = routerSchema;
};
