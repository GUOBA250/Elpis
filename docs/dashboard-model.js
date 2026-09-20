/**
 * Dashboard 模型定义与工具模块
 *
 * 本模块定义了 Dashboard 模板的数据结构规范，并提供配置创建、验证等工具函数。
 * 适用于 app/model 目录下的各业务模型配置（如 pdd.js、taobao.js 等）。
 *
 * 数据结构概览：
 * ┌─────────────────────────────────────────────────────┐
 * │ DashboardModel                                      │
 * │ ├── mode: 'dashboard'                               │
 * │ ├── name: string                                    │
 * │ ├── desc: string                                    │
 * │ ├── icon: string                                    │
 * │ ├── homePage: string                                │
 * │ └── menu: MenuItem[]                                │
 * │     └── MenuItem                                    │
 * │         ├── key: string                             │
 * │         ├── name: string                            │
 * │         ├── menuType: 'group' | 'module'            │
 * │         ├── subMenu?: MenuItem[]  (group 类型)      │
 * │         ├── moduleType?: 'sider'|'iframe'|'custom'  │
 * │         │              |'schema'  (module 类型)     │
 * │         ├── siderConfig?    (moduleType=sider)      │
 * │         ├── iframeConfig?   (moduleType=iframe)     │
 * │         ├── customConfig?   (moduleType=custom)     │
 * │         └── schemaConfig?   (moduleType=schema)     │
 * └─────────────────────────────────────────────────────┘
 */

'use strict'

// ==================== 枚举常量定义 ====================

/**
 * 菜单类型枚举
 * @readonly
 * @enum {string}
 */
const MENU_TYPE = {
    /** 分组菜单：可包含子菜单 */
    GROUP: 'group',
    /** 模块菜单：对应具体的页面模块 */
    MODULE: 'module'
}

/**
 * 模块类型枚举
 * @readonly
 * @enum {string}
 */
const MODULE_TYPE = {
    /** 侧边栏模块 */
    SIDER: 'sider',
    /** iframe 嵌入模块 */
    IFRAME: 'iframe',
    /** 自定义组件模块 */
    CUSTOM: 'custom',
    /** Schema 驱动的表格模块 */
    SCHEMA: 'schema'
}

/**
 * Schema 字段类型枚举
 * @readonly
 * @enum {string}
 */
const SCHEMA_FIELD_TYPE = {
    STRING: 'string',
    NUMBER: 'number',
    INTEGER: 'integer',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    ARRAY: 'array'
}

// ==================== 工厂函数 ====================

/**
 * 创建 Dashboard 模型配置
 * @param {Object} [options={}] - 配置选项
 * @param {string} [options.name=''] - 模板名称
 * @param {string} [options.desc=''] - 模板描述
 * @param {string} [options.icon=''] - 模板图标
 * @param {string} [options.homePage=''] - 首页路径
 * @param {Array} [options.menu=[]] - 菜单列表
 * @returns {Object} Dashboard 模型配置对象
 */
const createDashboardModel = (options = {}) => {
    const {
        name = '',
        desc = '',
        icon = '',
        homePage = '',
        menu = []
    } = options

    return {
        mode: 'dashboard',
        name,
        desc,
        icon,
        homePage,
        menu
    }
}

/**
 * 创建菜单项
 * @param {Object} options - 菜单项配置
 * @param {string} options.key - 菜单唯一标识
 * @param {string} options.name - 菜单名称
 * @param {string} options.menuType - 菜单类型，见 MENU_TYPE
 * @param {Array} [options.subMenu] - 子菜单列表（menuType=group 时）
 * @param {string} [options.moduleType] - 模块类型（menuType=module 时）
 * @param {Object} [options.siderConfig] - 侧边栏配置
 * @param {Object} [options.iframeConfig] - iframe 配置
 * @param {Object} [options.customConfig] - 自定义配置
 * @param {Object} [options.schemaConfig] - Schema 配置
 * @returns {Object} 菜单项对象
 */
const createMenuItem = (options = {}) => {
    const {
        key,
        name,
        menuType,
        subMenu,
        moduleType,
        siderConfig,
        iframeConfig,
        customConfig,
        schemaConfig
    } = options

    if (!key) {
        throw new Error('[createMenuItem] 菜单项必须提供 key 属性')
    }
    if (!name) {
        throw new Error('[createMenuItem] 菜单项必须提供 name 属性')
    }
    if (!Object.values(MENU_TYPE).includes(menuType)) {
        throw new Error(`[createMenuItem] 无效的 menuType: ${menuType}，有效值为: ${Object.values(MENU_TYPE).join(', ')}`)
    }

    const item = { key, name, menuType }

    if (menuType === MENU_TYPE.GROUP) {
        item.subMenu = Array.isArray(subMenu) ? subMenu : []
    }

    if (menuType === MENU_TYPE.MODULE) {
        if (!Object.values(MODULE_TYPE).includes(moduleType)) {
            throw new Error(`[createMenuItem] 无效的 moduleType: ${moduleType}，有效值为: ${Object.values(MODULE_TYPE).join(', ')}`)
        }
        item.moduleType = moduleType

        switch (moduleType) {
            case MODULE_TYPE.SIDER:
                item.siderConfig = siderConfig || { menu: [] }
                break
            case MODULE_TYPE.IFRAME:
                item.iframeConfig = iframeConfig || { path: '' }
                break
            case MODULE_TYPE.CUSTOM:
                item.customConfig = customConfig || { path: '' }
                break
            case MODULE_TYPE.SCHEMA:
                item.schemaConfig = schemaConfig || createSchemaConfig()
                break
        }
    }

    return item
}

/**
 * 创建 Schema 配置
 * @param {Object} [options={}] - Schema 配置选项
 * @param {string} [options.api=''] - 数据源 API 路径
 * @param {Object} [options.schema=null] - Schema 定义对象
 * @param {Object} [options.tableConfig={}] - 表格配置
 * @param {Object} [options.searchConfig={}] - 搜索栏配置
 * @param {Object} [options.components={}] - 自定义组件映射
 * @returns {Object} Schema 配置对象
 */
const createSchemaConfig = (options = {}) => {
    const {
        api = '',
        schema = null,
        tableConfig = {},
        searchConfig = {},
        components = {}
    } = options

    return {
        api,
        schema: schema || {
            type: 'object',
            properties: {}
        },
        tableConfig,
        searchConfig,
        components
    }
}

/**
 * 创建 Schema 字段定义
 * @param {Object} options - 字段配置
 * @param {string} options.type - 字段类型，见 SCHEMA_FIELD_TYPE
 * @param {string} [options.label=''] - 字段显示名称
 * @param {Object} [options.tabelOption={}] - 表格列配置
 * @param {Object} [options.searchOption={}] - 搜索项配置
 * @param {*} [options.default] - 默认值
 * @returns {Object} Schema 字段定义对象
 */
const createSchemaField = (options = {}) => {
    const {
        type,
        label = '',
        tabelOption = {},
        searchOption = {},
        default: defaultValue
    } = options

    if (!type) {
        throw new Error('[createSchemaField] 字段必须提供 type 属性')
    }

    const field = { type, label, tabelOption, searchOption }

    if (defaultValue !== undefined) {
        field.default = defaultValue
    }

    return field
}

// ==================== 验证函数 ====================

/**
 * 验证 Dashboard 模型配置
 * @param {Object} model - 待验证的 Dashboard 模型
 * @returns {{ valid: boolean, errors: string[] }} 验证结果
 */
const validateDashboardModel = (model) => {
    const errors = []

    if (!model || typeof model !== 'object') {
        return { valid: false, errors: ['模型配置必须是一个对象'] }
    }

    if (model.mode !== 'dashboard') {
        errors.push(`mode 必须为 'dashboard'，当前值: ${model.mode}`)
    }

    if (typeof model.name !== 'string') {
        errors.push('name 必须是字符串类型')
    }

    if (model.homePage && typeof model.homePage !== 'string') {
        errors.push('homePage 必须是字符串类型')
    }

    if (!Array.isArray(model.menu)) {
        errors.push('menu 必须是数组类型')
    } else {
        model.menu.forEach((item, index) => {
            const itemErrors = validateMenuItem(item, `menu[${index}]`)
            errors.push(...itemErrors)
        })
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * 验证菜单项配置
 * @param {Object} item - 菜单项
 * @param {string} [path='menu'] - 错误路径前缀
 * @returns {string[]} 错误信息列表
 */
const validateMenuItem = (item, path = 'menu') => {
    const errors = []

    if (!item || typeof item !== 'object') {
        errors.push(`${path} 必须是一个对象`)
        return errors
    }

    if (!item.key) {
        errors.push(`${path}.key 不能为空`)
    }

    if (!item.name) {
        errors.push(`${path}.name 不能为空`)
    }

    if (!Object.values(MENU_TYPE).includes(item.menuType)) {
        errors.push(`${path}.menuType 无效，有效值为: ${Object.values(MENU_TYPE).join(', ')}`)
        return errors
    }

    if (item.menuType === MENU_TYPE.GROUP) {
        if (item.subMenu && !Array.isArray(item.subMenu)) {
            errors.push(`${path}.subMenu 必须是数组类型`)
        } else if (Array.isArray(item.subMenu)) {
            item.subMenu.forEach((subItem, index) => {
                const subErrors = validateMenuItem(subItem, `${path}.subMenu[${index}]`)
                errors.push(...subErrors)
            })
        }
    }

    if (item.menuType === MENU_TYPE.MODULE) {
        if (!Object.values(MODULE_TYPE).includes(item.moduleType)) {
            errors.push(`${path}.moduleType 无效，有效值为: ${Object.values(MODULE_TYPE).join(', ')}`)
            return errors
        }

        switch (item.moduleType) {
            case MODULE_TYPE.SIDER:
                if (!item.siderConfig || typeof item.siderConfig !== 'object') {
                    errors.push(`${path}.siderConfig 必须存在且为对象`)
                }
                break
            case MODULE_TYPE.IFRAME:
                if (!item.iframeConfig || typeof item.iframeConfig.path !== 'string') {
                    errors.push(`${path}.iframeConfig.path 必须存在且为字符串`)
                }
                break
            case MODULE_TYPE.CUSTOM:
                if (!item.customConfig || typeof item.customConfig.path !== 'string') {
                    errors.push(`${path}.customConfig.path 必须存在且为字符串`)
                }
                break
            case MODULE_TYPE.SCHEMA:
                const schemaErrors = validateSchemaConfig(item.schemaConfig, `${path}.schemaConfig`)
                errors.push(...schemaErrors)
                break
        }
    }

    return errors
}

/**
 * 验证 Schema 配置
 * @param {Object} config - Schema 配置
 * @param {string} [path='schemaConfig'] - 错误路径前缀
 * @returns {string[]} 错误信息列表
 */
const validateSchemaConfig = (config, path = 'schemaConfig') => {
    const errors = []

    if (!config || typeof config !== 'object') {
        errors.push(`${path} 必须存在且为对象`)
        return errors
    }

    if (typeof config.api !== 'string') {
        errors.push(`${path}.api 必须是字符串类型`)
    }

    if (!config.schema || typeof config.schema !== 'object') {
        errors.push(`${path}.schema 必须存在且为对象`)
    } else if (config.schema.properties && typeof config.schema.properties !== 'object') {
        errors.push(`${path}.schema.properties 必须是对象类型`)
    }

    return errors
}

// ==================== 辅助工具函数 ====================

/**
 * 深度合并两个配置对象（数组按 key 合并）
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的新对象
 */
const deepMergeConfig = (target, source) => {
    if (Array.isArray(target) && Array.isArray(source)) {
        const result = [...target]
        source.forEach(item => {
            const existingIndex = result.findIndex(t => t.key && item.key && t.key === item.key)
            if (existingIndex > -1) {
                result[existingIndex] = deepMergeConfig(result[existingIndex], item)
            } else {
                result.push(item)
            }
        })
        return result
    }

    if (target && typeof target === 'object' && source && typeof source === 'object') {
        const result = { ...target }
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (result[key] !== undefined && typeof result[key] === 'object' && typeof source[key] === 'object') {
                    result[key] = deepMergeConfig(result[key], source[key])
                } else {
                    result[key] = source[key]
                }
            }
        }
        return result
    }

    return source !== undefined ? source : target
}

/**
 * 从菜单列表中查找指定 key 的菜单项（递归）
 * @param {Array} menuList - 菜单列表
 * @param {string} key - 要查找的 key
 * @returns {Object|null} 找到的菜单项，未找到返回 null
 */
const findMenuItemByKey = (menuList, key) => {
    if (!Array.isArray(menuList)) return null

    for (const item of menuList) {
        if (!item) continue
        if (item.key === key) return item

        if (item.subMenu && Array.isArray(item.subMenu)) {
            const found = findMenuItemByKey(item.subMenu, key)
            if (found) return found
        }

        if (item.siderConfig && Array.isArray(item.siderConfig.menu)) {
            const found = findMenuItemByKey(item.siderConfig.menu, key)
            if (found) return found
        }
    }

    return null
}

/**
 * 获取菜单中的所有模块类型菜单项（扁平化）
 * @param {Array} menuList - 菜单列表
 * @returns {Array} 所有模块类型的菜单项
 */
const flattenModuleItems = (menuList) => {
    const result = []

    const traverse = (list) => {
        if (!Array.isArray(list)) return
        for (const item of list) {
            if (!item) continue
            if (item.menuType === MENU_TYPE.MODULE) {
                result.push(item)
            }
            if (item.subMenu) traverse(item.subMenu)
            if (item.siderConfig && item.siderConfig.menu) {
                traverse(item.siderConfig.menu)
            }
        }
    }

    traverse(menuList)
    return result
}

// ==================== 导出 ====================

module.exports = {
    // 枚举常量
    MENU_TYPE,
    MODULE_TYPE,
    SCHEMA_FIELD_TYPE,

    // 工厂函数
    createDashboardModel,
    createMenuItem,
    createSchemaConfig,
    createSchemaField,

    // 验证函数
    validateDashboardModel,
    validateMenuItem,
    validateSchemaConfig,

    // 工具函数
    deepMergeConfig,
    findMenuItemByKey,
    flattenModuleItems
}
