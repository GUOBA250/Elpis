const path = require("path");
const koaNunjucks = require("koa-nunjucks-2");

module.exports = (app) => {
  // 配置静态根目录
  const koaStatic = require("koa-static");

  app.use(koaStatic(path.resolve(__dirname, "./public")));
  app.use(koaStatic(path.resolve(process.cwd(), "./app/public")));

  // 模板渲染引擎
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.join(process.cwd(), "./app/public"),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    })
  );

  // 引入 koa-bodyparser 并进行配置，解析ctx.body
  const koaBodyparser = require("koa-bodyparser");
  app.use(
    koaBodyparser({
      formLimit: "1000mb",
      enableTypes: ["json", "form", "text"],
    })
  );

  // 引入异常捕获中间件
  app.use(app.middlewares.errorHandler);

  // 引入 API 签名验证中间件
  app.use(app.middlewares.apiSignVerify);

  // 引入 API 参数验证中间件
  app.use(app.middlewares.apiParamsVerify);

  // 引入 项目相关处理 中间件
  app.use(app.middlewares.projectHandler);
};
