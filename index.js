// 引入 elpis 核心
const Elpis = require("./elpis-core");
// 引入 前端工程构建方法
const FEBuildDev = require("./app/webpack/dev.js");
const FEBuildProd = require("./app/webpack/prod.js");

module.exports = {
  /**
   * 服务端基础
   */
  Controller: {
    Base: require("./app/controller/base.js"),
  },
  Service: {
    Base: require("./app/service/base.js"),
  },
  /**
   * 编译构建前端工程
   * @params env 环境变量 local/production
   */
  frontendBuild(env) {
    if (env === "local") {
      FEBuildDev();
    } else if (env === "production") {
      FEBuildProd();
    }
  },
  /**
   * 启动 elpis
   * @param {*} options 项目配置，传到 elpis-core
   * 例：{ name: "Elpis", homePage: "/view/project-list" }
   */
  serverStart(options = {}) {
    const app = Elpis.start(options);
    return app;
  },
};
