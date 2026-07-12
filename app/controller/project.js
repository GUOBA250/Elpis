module.exports = (app) => {
    const BaseController = require('./base')(app)
    return class ProjectController extends BaseController {
        /**
         * 获取项目列表
         * @param {object} ctx 上下文
         */
        async getList(ctx) {
            const { proj_key: projKey } = ctx.request.query
            const { project: projectService } = app.service;
            const res = await projectService.getList(projKey);
            this.success(ctx, res);
        }
    }
}   