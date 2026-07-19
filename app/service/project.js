module.exports = (app) => {
    const BaseService = require('./base')(app);
    const getModelList = require('../model/index.js')
    const modelList = getModelList()
    return class ProjectService extends BaseService {
        /**
         * 获取当前 projectKey 对应模型下的项目列表（如果 projectKey 为空，则返回所有项目）
         * @param {string} projKey 项目模型键
         * @returns {Promise<Array>}
         */
        getList(projKey) {
            const projectList = []

            return modelList.reduce((preList, modelItem) => {
                const { project } = modelItem

                if (projKey) {
                    if (project[projKey]) {
                        preList.push(project[projKey])
                    }
                } else {
                    for (const pKey in project) {
                        preList.push(project[pKey])
                    }
                }

                return preList
            }, [])
        }
        /**
         * 获取项目模型列表
         * @returns {Promise<Array>}
         */
        async getModelList() {
            return modelList
        }
    }
}