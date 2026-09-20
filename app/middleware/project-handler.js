/**
 * 项目相关处理，项目全局变量挂载到ctx
 * @param {object} app koa 实例
 */
const projectHandler = (app) => {
  // 项目发现类接口豁免：调用方在得知 proj_key 之前就需要访问（与 router-schema 中 proj_key 可选的契约保持一致）
  const PROJ_KEY_OPTIONAL_PATHS = ["/api/proj/model_list", "/api/proj/list"];

  return async (ctx, next) => {
    // 只对 业务API 进行 proj_key 处理
    if (
      ctx.path.indexOf("/api/proj/") < 0 ||
      PROJ_KEY_OPTIONAL_PATHS.includes(ctx.path)
    ) {
      return await next();
    }
    // 获取projKey（兼容请求头与 query 参数两种传递方式）
    const { proj_key: headerProjKey } = ctx.request.headers;
    const projKey = headerProjKey || ctx.request.query?.proj_key;
    if (!projKey) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "缺少proj_key",
        code: 446,
      };
      return;
    }
    ctx.projKey = projKey;
    await next();
  };
};

module.exports = projectHandler;
