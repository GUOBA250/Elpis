module.exports = () => {
    return {
        mode: 'dashboard',
        name: '抖音',
        desc: '抖音数据监控仪表板',
        icon: 'el-icon-music',
        homePage: '/iframe',
        menu: [{
            key: 'douyin-data',
            name: '数据分析',
            menuType: 'group',
            subMenu: [{
                key: 'video-data',
                name: '视频数据',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/douyin/video'
                }
            }, {
                key: 'live-data',
                name: '直播数据',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                    path: '/douyin/live'
                }
            }]
        }, {
            key: 'douyin-config',
            name: '配置管理',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
                api: '/api/douyin/config',
                schema: {
                    type: 'object',
                    properties: {
                        openId: {
                            type: 'string',
                            label: 'OpenID'
                        },
                        accessToken: {
                            type: 'string',
                            label: 'Access Token'
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