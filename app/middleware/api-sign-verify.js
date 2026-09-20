const md5 = require("md5");
/**
 * 只对 API 做签名校验
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 白名单放过
    if (app.config?.apiSignVerify?.whiteList?.includes(ctx.path)) {
      return await next();
    }

    // 只对 API 接口进行处理
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;

    // 签名密钥从配置读取（config/config.*.js 的 apiSignVerify.signKey）
    const signKey = app.config?.apiSignVerify?.signKey;
    if (!signKey) {
      // 未配置签名密钥时直接拒绝，避免静默放行
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "signature not correct!!!",
        code: 445,
      };
      return;
    }

    const ts = Number(st);
    const signature = md5(`${signKey}_${st}`);

    app.logger.info(`[${method} ${path}] signature: ${signature}`);

    if (
      !sSign ||
      !st ||
      Number.isNaN(ts) ||
      ts > Date.now() + 60 * 1000 || // 拒绝未来时间戳（允许 60 秒时钟偏差）
      signature !== sSign.toLowerCase() ||
      Date.now() - ts > 60 * 1000 * 10 // 600秒失效
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "signature not correct!!!",
        code: 445,
      };
      return;
    }
    await next();
  };
};
