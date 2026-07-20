module.exports = () => {
    return {
        mode: 'dashboard',
        name: '拼多多',
        desc: '拼多多数据监控仪表板',
        icon: 'el-icon-shopping-cart',
        homePage: '/iframe',
        menu: [{
            key: 'pdd-data',
            name: '数据分析',
            menuType: 'group',
            subMenu: [{
                key: 'order-analysis',
                name: '订单分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/pdd/order'
                }
            }, {
                key: 'product-analysis',
                name: '商品分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/pdd/product'
                }
            }]
        }, {
            key: 'pdd-config',
            name: '配置管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/pdd/config',
                schema: {
                    type: 'object',
                    properties: {
                        clientId: {
                            type: 'string',
                            label: 'Client ID'
                        },
                        clientSecret: {
                            type: 'string',
                            label: 'Client Secret'
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