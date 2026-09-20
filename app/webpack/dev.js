// 本地开发启动 devServer
const express = require("express");
const path = require("path");
const webpack = require("webpack");
const consoler = require("consoler");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

module.exports = () => {
  // 从webpack.dev.js获取配置和devServer配置
  const {
    DEV_SERVER_CONFIG,
    webpackConfig,
  } = require("./config/webpack.dev.js");

  const app = express();

  const compiler = webpack(webpackConfig);

  // 指定静态文件目录
  app.use(express.static(path.join(process.cwd(), "./app/public/dist")));

  // 引用 devMiddleware 中间件（监控文件改变）
  app.use(
    devMiddleware(compiler, {
      // 落地文件
      writeToDisk: (filePath) => {
        return filePath.endsWith(".tpl");
      },
      // 资源路径
      publicPath: webpackConfig.output.publicPath,
      // headers 配置
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      stats: {
        colors: true,
      },
    })
  );

  // 引用 hotMiddleware 中间件（热更新）
  app.use(
    hotMiddleware(compiler, {
      path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
      log: () => {},
    })
  );

  consoler.info("请等待webpack初次构建完成");

  // 启动服务
  const port = DEV_SERVER_CONFIG.PORT;

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};
