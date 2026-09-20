const glob = require("glob");
const path = require("path");
const { sep } = path;

const KoaRouter = require("koa-router");

/**
 * router loader
 * @param {Object} app Koa 实例
 *
 * 解析所有 app/router 目录下的所有文件，加载到KoaRouter中
 */
module.exports = (app) => {
  // 实例化 KoaRouter
  const router = new KoaRouter();

  // 找到 elpis 路由文件
  const elpisRouterPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}router`
  );

  // 注册所有 elpis 路由
  const elpisFileList = glob.sync(
    path.resolve(elpisRouterPath, `.${sep}**${sep}**.js`)
  );
  elpisFileList.forEach((file) => {
    // router file 导出一个函数，参数为 app 和 router
    // 执行函数时，会将路由注册到koa-router上
    require(path.resolve(file))(app, router);
  });

  // 找到 业务 路由文件
  const businessRouterPath = path.resolve(app.bussinessPath, `.${sep}router`);

  // 注册所有 业务 路由
  const businessFileList = glob.sync(
    path.resolve(businessRouterPath, `.${sep}**${sep}**.js`)
  );
  businessFileList.forEach((file) => {
    // router file 导出一个函数，参数为 app 和 router
    // 执行函数时，会将路由注册到koa-router上
    require(path.resolve(file))(app, router);
  });

  // 路由兜底
  router.get("*", async (ctx) => {
    ctx.status = 302; // 临时重定向
    ctx.redirect(`${app?.options?.homePage ?? "/"}`);
  });

  // 路由挂载到app上
  app.use(router.routes());
  app.use(router.allowedMethods());
};
