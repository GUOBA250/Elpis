const _ = require('lodash')
const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * 模型与项目数据合并函数
 * 将项目配置扩展到模型配置上，支持数组和对象的递归合并
 * @param {object|array} model - 基础模型配置
 * @param {object|array} project - 项目扩展配置
 * @returns {object|array} 合并后的配置对象或数组
 */
const projectExtendModel = (model, project) => {
    // 非数组类型直接使用 lodash 合并
    if (!Array.isArray(model) || !Array.isArray(project)) {
        return _.mergeWith({}, model, project)
    }

    let result = []

    // 遍历模型数组，将项目配置合并到对应模型项
    for (let i = 0; i < model.length; ++i) {
        let modelItem = model[i]
        const projItem = project.find(projItem => projItem.key === modelItem.key)
        result.push(projItem ? projectExtendModel(modelItem, projItem) : modelItem)
    }

    // 遍历项目数组，添加模型中不存在的新项目项
    for (let i = 0; i < project.length; ++i) {
        let projItem = project[i]
        const modelItem = model.find(modelItem => modelItem.key === projItem.key)
        if (!modelItem) {
            result.push(projItem)
        }
    }
    return result
}

/**
 * 模型加载器函数
 * 扫描并加载 model 目录下的所有模型和项目配置文件
 * @param {object} app - 应用实例，包含 baseDir 等配置
 * @returns {array} 加载后的模型列表
 */
const modelLoader = (app) => {
    const modelList = []

    // 构建模型目录路径
    const modelPath = path.resolve(app.baseDir, `.${sep}model`)
    // 扫描模型目录下所有 js 文件
    const fileList = glob.sync(path.resolve(modelPath, `**${sep}*.js`))

    fileList.forEach(file => {
        // 跳过 index.js 文件
        if (path.basename(file) === 'index.js') { return }

        // 判断文件类型：project 或 model
        const type = file.indexOf(`${sep}project${sep}`) > -1 ? 'project' : 'model'

        // 处理项目配置文件
        if (type === 'project') {
            // 从文件路径中提取 modelKey 和 projKey
            const modelKey = file.match(new RegExp(`\\${sep}model\\${sep}(.*?)\\${sep}project`))?.[1]
            const projKey = file.match(new RegExp(`\\${sep}project\\${sep}(.*?)\\${sep}`))?.[1] || path.basename(file, '.js')
            
            // 跳过无效的配置文件
            if (!modelKey || !projKey) { return }

            // 查找或创建模型项
            let modelItem = modelList.find(item => item.model?.key === modelKey)
            if (!modelItem) {
                modelItem = {}
                modelList.push(modelItem)
            }
            // 初始化项目对象
            if (!modelItem.project) {
                modelItem.project = {}
            }
            // 加载项目配置文件并设置 key
            modelItem.project[projKey] = require(path.resolve(file))
            modelItem.project[projKey].key = projKey
        }

        // 处理模型配置文件
        if (type === 'model') {
            // 从文件路径中提取 modelKey
            const modelKey = file.match(new RegExp(`\\${sep}model\\${sep}(.*?)\\${sep}model\\.js`))?.[1]
            
            // 跳过无效的配置文件
            if (!modelKey) { return }

            // 查找或创建模型项
            let modelItem = modelList.find(item => item.model?.key === modelKey)
            if (!modelItem) {
                modelItem = {}
                modelList.push(modelItem)
            }
            // 加载模型配置文件并设置 key
            modelItem.model = require(path.resolve(file))
            modelItem.model.key = modelKey
            
            // 如果已存在项目配置，为项目配置设置 modelKey
            if (modelItem.project) {
                for (const key in modelItem.project) {
                    modelItem.project[key].modelKey = modelKey
                }
            }
        }
    })

    // 将模型配置合并到项目配置中
    modelList.forEach(item => {
        const { model, project } = item
        if (model && project) {
            for (const key in project) {
                project[key] = projectExtendModel(model, project[key])
            }
        }
    })

    return modelList
}

modelLoader.__projectExtendModel = projectExtendModel

module.exports = modelLoader