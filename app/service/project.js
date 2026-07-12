module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService {
        /**
         * 获取项目列表
         * @param {string} projKey 项目 key
         * @returns {Promise<Array>}
         */
        async getList(projKey) {
            const projectList = [{
                name: 'project1',
                desc: 'project1 desc',
                key: 'p1'
            }, {
                name: 'project2',
                desc: 'project2 desc',
                key: 'p2'
            }, {
                name: 'project3',
                desc: 'project3 desc',
                key: 'p3'
            }]
            if (projKey) {
                return projectList.filter(item => item.key === projKey)
            }
            return projectList
        }
    }
}