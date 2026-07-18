const modelList = [
    {
        model: { key: 'm1', name: 'model1', desc: '模型1' },
        project: {
            p1: { key: 'p1', name: 'project1', desc: '项目1', homePage: '/page1' },
            p2: { key: 'p2', name: 'project2', desc: '项目2', homePage: '/page2' },
        }
    },
    {
        model: { key: 'm2', name: 'model2', desc: '模型2' },
        project: {
            p3: { key: 'p3', name: 'project3', desc: '项目3', homePage: '/page3' },
        }
    }
]

module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService {
        /**
         * 获取项目模型列表
         * @returns {Promise<Array>}
         */
        async getModelList() {
            return modelList
        }
    }
}