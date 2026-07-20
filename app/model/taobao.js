module.exports = () => {
    return {
        mode: 'dashboard',
        name: '淘宝',
        desc: '淘宝数据监控仪表板',
        icon: 'el-icon-s-shop',
        homePage: '/iframe',
        menu: [{
            key: 'taobao-data',
            name: '数据分析',
            menuType: 'group',
            subMenu: [{
                key: 'trade-analysis',
                name: '交易分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/taobao/trade'
                }
            }, {
                key: 'customer-analysis',
                name: '客户分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/taobao/customer'
                }
            }]
        }, {
            key: 'taobao-config',
            name: '配置管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/taobao/config',
                schema: {
                    type: 'object',
                    properties: {
                        appKey: {
                            type: 'string',
                            label: 'App Key'
                        },
                        appSecret: {
                            type: 'string',
                            label: 'App Secret'
                        }
                    }
                },
                tableConfig: {},
                searchConfig: {},
                components: {}
            }
        }]
    }
}