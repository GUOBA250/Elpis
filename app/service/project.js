module.exports = (app) => {
  const BaseService = require("./base")(app);
  const modelList = require("../../model/index.js")(app);
  return class ProjectService extends BaseService {
    // 根据 proj_key 获取项目详情
    async get(projKey) {
      const targetModel = modelList.find(({ project }) => !!project[projKey]);
      return targetModel ? targetModel.project[projKey] : null;
    }

    /**
     * 获取项目列表
     * 如果无 proj_key 参数，则返回所有项目列表
     */
    async getList({ projKey }) {
      return modelList.reduce((projectList, modelItem) => {
        const { project } = modelItem;
        // 如果 projKey 不存在，则返回
        if (projKey && !project[projKey]) {
          return projectList;
        }
        for (const pKey in project) {
          projectList.push(project[pKey]);
        }
        return projectList;
      }, []);
    }

    /**
     * 获取模型列表
     */
    async getModelList() {
      return modelList;
    }
  };
};
