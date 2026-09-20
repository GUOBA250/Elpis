module.exports = (app) => {
  return class BaseController {
    /**
     * service 基类
     * 统一收拢 service 相关的公共方法
     */
    constructor() {
      this.app = app;
      this.config = app.config;
    }
  };
};
