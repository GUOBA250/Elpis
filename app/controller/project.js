module.exports = (app) => {
    const BaseController = require('./base')(app)
    return class ProjectController extends BaseController {
        /**
         * 根据proj_key获取项目详情
         * @param {object} ctx 上下文
         */
        get(ctx) {
            const {
                proj_key: projKey
            } = ctx.request.query
            const { project: projectService } = app.service;
            
            if (!projKey) {
                this.fail(ctx, '项目标识不能为空', 442)
                return
            }
            
            const projectConfig = projectService.get(projKey);

            if (!projectConfig) {
                this.fail(ctx, '项目不存在', 404)
                return
            }
            this.success(ctx, projectConfig)
        }
        /**
         * 获取当前 projectKey 对应模型下的项目列表（如果 projectKey 为空，则返回所有项目）
         * @param {object} ctx 上下文
         */
        async getList(ctx) {
            const { proj_key: projKey } = ctx.request.query
            const { project: projectService } = app.service;
            const projectList = await projectService.getList(projKey);

            // 构造关键数据 list
            const dtoProjectList = projectList.map(item => {
                const { modelKey, key, name, desc, homePage } = item
                return { modelKey, key, name, desc, homePage }
            })
            // 构造返回结构，只返回关键数据
            this.success(ctx, dtoProjectList);
        }
        /**
         * 获取项目模型列表
         * @param {object} ctx 上下文
         */
        async getModelList(ctx) {
            const { project: projectService } = app.service;
            const modelList = await projectService.getModelList();

            // 构造返回结构，只返回关键数据
            const dtoModelList = modelList.reduce((preList, item) => {
                const { model, project } = item

                // 构造 model 关键数据
                const { key, name, desc } = model
                const dtomModel = { key, name, desc }

                // 构造 project 关键数据
                const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
                    const { key, name, desc, homePage } = project[projKey]
                    preObj[projKey] = { key, name, desc, homePage }
                    return preObj
                }, {})

                // 整合返回结构
                preList.push({
                    model: dtomModel,
                    project: dtoProject
                })

                return preList
            }, [])
            this.success(ctx, dtoModelList);
        }
    }
}   