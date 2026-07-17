// 本地开发启动 devServer
const express = require('express')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

// 从 webpack.dev.js 获取 webpack配置 和 devServer配置
const {
    webpackConfig,
    devServerConfig,
} = require('./config/webpack.dev.js')

const app = express()

const compiler = webpack(webpackConfig)

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist')))

// 引用 devMiddleware 中间件（监控文件改动）
app.use(devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => { return filePath.endsWith('.tpl') },

    // 资源路径
    publicPath: webpackConfig.output.publicPath,

    // headers 配置
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Request-Id',
    },

    stats: {
        colors: true,
    }
}))

// 引用 hotMiddleware 中间件（热模块替换）
app.use(hotMiddleware(compiler, {
    path: `${devServerConfig.HMR_PATH}`,
    log: () => {}
}))
