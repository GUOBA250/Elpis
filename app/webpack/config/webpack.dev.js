const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

// 基类配置
const baseConfig = require('./webpack.base.js')

// devServer 配置
const devServerConfig = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '/__webpack_hmr',
    TIMEOUT: 20000,
}

// 开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach(v => {
    // 第三方包不作为 hmr 入口
    if (v !== 'vendor') {
        baseConfig.entry[v] = [
            // 主入口文件
            baseConfig.entry[v],
            // 开发环境的 hmr 配置
            `webpack-hot-middleware/client?path=http://${devServerConfig.HOST}:${devServerConfig.PORT}/${devServerConfig.HMR_PATH}?timeout=${devServerConfig.TIMEOUT}&reload=true`,
        ]
    }
})

// 开发环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
    // 指定开发环境模式
    mode: 'development',
    // 开发阶段 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/dev/'), //输出文件存储路径
        publicPath: `http://${devServerConfig.HOST}:${devServerConfig.PORT}/public/dist/dev/`, // 外部资源公共路径
        globalObject: 'this', // 全局对象，用于 hmr 插件的全局变量
    },
    // 开发阶段插件
    plugins: [
        // HotModuleReplacementPlugin 用于实现热模块替换 
        // 模块热替换允许在应用程序运行时替换模块
        // 极大的提升开发效率，因为能让应用程序在不刷新页面的情况下更新模块
        new webpack.HotModuleReplacementPlugin({
            multiStep: false,
        })
    ]
})

module.exports = {
    // webpack 配置
    webpackConfig,
    // devServer 配置
    devServerConfig,
}
