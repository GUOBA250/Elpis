const Ajv = require("ajv");
const ajv = new Ajv();
const { match } = require("path-to-regexp");

/**
 * 只对 API 做参数校验
 */
module.exports = (app) => {
  // 校验器缓存（挂载到 app 上，随应用生命周期；避免每个请求重复 ajv.compile）
  if (!app.paramsValidateCache) {
    app.paramsValidateCache = new Map();
  }

  return async (ctx, next) => {
    // 只对 API 接口进行处理
    if (ctx.path.indexOf("/api/") < 0) {
      return await next();
    }
    const { body, query, headers } = ctx.request;
    const { path, method } = ctx;

    let params;

    // 调试日志仅本地环境输出，且不记录 headers（避免签名、Cookie 等敏感信息落盘）
    if (app.env.isLocal()) {
      app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`);
      app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`);
    }

    // 读取路由格式配置
    let schema = app.routerSchema[`${path}`]?.[method.toLowerCase()];

    if (!schema) {
      /**
       * 如果通过对象查找无法匹配到路由，尝试使用path-to-regexp进行匹配
       * 主要是处理动态路由的params无法获取的问题
       * 例：/api/users/:id
       */
      Object.keys(app.routerSchema)
        .filter((item) => item.indexOf(":") > -1)
        .some((pathStr) => {
          try {
            const matchFn = match(pathStr);
            const matched = matchFn(path);
            if (matched) {
              schema = app.routerSchema[pathStr]?.[method.toLowerCase()];
              const routeParams = matched.params;
              params = routeParams;
              return true;
            }
          } catch (error) {
            console.log(error);
          }
        });
    }
    if (!schema) {
      return await next();
    }

    // params 在动态路由匹配后才可能被赋值，此处记录才有意义（仅本地环境）
    if (app.env.isLocal()) {
      app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`);
    }

    // 获取（或创建并缓存）指定部分的 ajv 校验器，避免重复编译且不改动共享 schema 对象
    const getValidator = (part, partSchema) => {
      const cacheKey = `${path}|${method}|${part}`;
      let validate = app.paramsValidateCache.get(cacheKey);
      if (!validate) {
        validate = ajv.compile(partSchema);
        app.paramsValidateCache.set(cacheKey, validate);
      }
      return validate;
    };

    let valid = true;

    // ajv 校验器
    let validate;

    // 校验 headers
    if (valid && headers && schema.headers) {
      validate = getValidator("headers", schema.headers);
      valid = validate(headers);
    }

    // 校验 body
    if (valid && body && schema.body) {
      validate = getValidator("body", schema.body);
      valid = validate(body);
    }
    // 校验 query
    if (valid && query && schema.query) {
      validate = getValidator("query", schema.query);
      valid = validate(query);
    }
    // 校验 params
    if (valid && params && schema.params) {
      validate = getValidator("params", schema.params);
      valid = validate(params);
    }

    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: `request validate failed: ${ajv.errorsText(validate.errors)}`,
        code: 442,
      };
      return;
    }

    await next();
  };
};
