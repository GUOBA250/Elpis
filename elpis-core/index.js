const Koa = require("koa");
const path = require("path");

const { sep } = path; // 兼容不同操作系统的斜杠

const env = require("./env");

const middlewareLoader = require("./loader/middleware");
const configLoader = require("./loader/config");
const routerLoader = require("./loader/router");
const routerSchemaLoader = require("./loader/router-schema");
const serviceLoader = require("./loader/service");
const extendLoader = require("./loader/extend");
const controllerLoader = require("./loader/controller");

module.exports = {
  /**
   * 启动项目
   * @param {Object} options 项目配置
   * options: {
   *  name: 'Elpis', // 项目名称
   *  baseDir: '', // 项目根目录
   *  bussinessPath: 'app', // 业务文件路径
   *  homePage: '/', // 首页路径
   * }
   */
  start(options = {}) {
    const app = new Koa();

    // 应用配置
    app.options = options;

    // 项目名称
    app.name = options.name || "Elpis";

    // 初始化环境配置
    app.env = env();
    console.log("app.env", app.env.get());

    // 基础路径
    app.baseDir = path.resolve(process.cwd(), options.baseDir || "");

    // 业务文件路径
    app.bussinessPath = path.resolve(app.baseDir, options.bussinessPath || `.${sep}app`);

    // 加载中间件
    middlewareLoader(app);
    console.log("-- [start] loaded middleware done ");

    // 加载 routerSchema
    routerSchemaLoader(app);
    console.log("-- [start] loaded routerSchema done ");

    // 加载 controller
    controllerLoader(app);
    console.log("-- [start] loaded controllerLoader done ");

    // 加载 service
    serviceLoader(app);
    console.log("-- [start] loaded serviceLoader done ");

    // 加载 config
    configLoader(app);
    console.log("-- [start] loaded configLoader done ");

    // 加载 extend
    extendLoader(app);
    console.log("-- [start] loaded extendLoader done ");

    // 注册 elpis 全局中间件
  const elpisMiddlewarePath = path.resolve(__dirname, `..${sep}app${sep}middleware.js`);
  try {
    require(elpisMiddlewarePath)(app);
    console.log("-- [start] loaded global elpis middleware done ");
  } catch (error) {
    console.error("[exception] load global elpis middleware failed:", error);
  }

  // 注册业务全局中间件
  // 注意：standalone 场景下业务路径与 elpis 路径可能指向同一文件，需跳过以避免中间件重复注册
  const businessMiddlewarePath = path.resolve(app.bussinessPath, `.${sep}middleware.js`);
  if (businessMiddlewarePath !== elpisMiddlewarePath) {
    try {
      require(businessMiddlewarePath)(app);
      console.log("-- [start] loaded global business middleware done ");
    } catch (error) {
      console.error("[exception] load global business middleware failed:", error);
    }
  }

    // 加载 router
    routerLoader(app);
    console.log("-- [start] loaded routerLoader done ");

    // options.listen === false 时不监听端口（用于测试等场景，配合 supertest 使用）
    if (options.listen !== false) {
      const port = process.env.PORT || 8080;
      const host = process.env.IP || "0.0.0.0";

      const server = app.listen(port, host, () => {
        console.log(`Server Listening on ${host}:${port}`);
      });

      // 捕获监听异常（如端口占用 EADDRINUSE），避免异步错误导致进程无提示崩溃
      server.on("error", (err) => {
        console.error(`[server error] ${err.message}`);
      });
    }

    return app;
  },
};
