const _ = require("lodash");

module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**
     * 根据 proj_key 获取项目详情
     * @@param {object} ctx 上下文
     */
    async get(ctx) {
      const { project: projectService } = app.service;
      const { proj_key: projKey } = ctx.request.query;
      const projectConfig = await projectService.get(projKey);

      if (!projectConfig) {
        this.fail(ctx, "获取项目异常", 50000);
        return;
      }

      this.success(ctx, projectConfig);
    }

    /**
     * 获取项目列表
     * query: {
     *   proj_key: string
     * }
     * @@param {object} ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = app.service;
      const { proj_key: projKey } = ctx.request.query;
      const projectList = await projectService.getList({ projKey });

      const dtoProjectList = projectList.map((item) => {
        return _.pick(item, ["name", "key", "modelKey", "desc", "homePage"]);
      });

      this.success(ctx, dtoProjectList);
    }

    /**
     * 获取所有模型与项目的结构化数据
     * @@param {object} ctx 上下文
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();

      // 构造返回结果，只返回关键数据
      const dtoModelList = modelList.reduce((list, item) => {
        const { model, project } = item;
        // 构造 model 的结构化数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };
        // 构造 project 的结构化数据（字段与 getList 的 DTO 保持一致，包含 modelKey）
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage, modelKey } = project[projKey];
          preObj[projKey] = { key, name, desc, homePage, modelKey };
          return preObj;
        }, {});

        // 整合返回结构
        list.push({
          model: dtoModel,
          project: dtoProject,
        });
        return list;
      }, []);

      this.success(ctx, dtoModelList);
    }
  };
};
