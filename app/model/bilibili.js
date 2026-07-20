module.exports = () => {
    return {
        mode: 'dashboard',
        name: '哔哩哔哩',
        desc: 'B站数据监控仪表板',
        icon: 'el-icon-video-play',
        homePage: '/iframe',
        menu: [{
            key: 'bilibili-data',
            name: '数据分析',
            menuType: 'group',
            subMenu: [{
                key: 'video-analysis',
                name: '视频分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/bilibili/video'
                }
            }, {
                key: 'fan-analysis',
                name: '粉丝分析',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/bilibili/fan'
                }
            }]
        }, {
            key: 'bilibili-config',
            name: '配置管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/bilibili/config',
                schema: {
                    type: 'object',
                    properties: {
                        uid: {
                            type: 'string',
                            label: 'B站UID'
                        },
                        cookie: {
                            type: 'string',
                            label: 'Cookie'
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