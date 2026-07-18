{
    mode: 'dashboard', // 模板类型，不同模板类型对应不一样的模板数据结构
    name: '', // 模板名称
    desc: '', // 模板描述
    icon: '', // 模板图标
    homePage: '', // 首页路径

    // 头部菜单
    menu: [{
        key: '', //菜单唯一描述
        name: '', //菜单名称
        menuType: '', // 枚举值， group 或 module

        // 当 menuType == group 时，可填
        subMenu: [{
            // 可递归 menuItem
        }, ...],

        // 当 menuType == module 时，可填
        moduleType: '', // 枚举值：sider/iframe/custom/schema

        // 当 moduleType == sider 时
        siderConfig: {
            menu: [{
                // 可递归 menuItem（除 moduleType === sider）
            }]
        },

        // 当 moduleType == iframe 时
        iframeConfig: {
            path: '' // iframe 加载的路径
        },

        // 当 moduleType == custom 时
        customConfig: {
            path: '' // custom 加载的路径
        },

        // 当 moduleType == schema 时
        schemaConfig: {
            api: '', //数据源API（遵循 RESTFUL 规范）
            shcema: {
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准 schema 配置
                        type: '',  //字段类型
                        label: '', //字段的中文名
                    },
                    ...
                }
            },
            tableConfig: {}, // table 相关配置
            searchConfig: {}, // search-bar 相关配置
            components: {}  // 模块组件
        }
    }, ...]
}