const merge = require('webpack-merge')
const path = require('path')

// 基类配置
const baseConfig = require('./webpack.base.js')

// 开发环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
    // 开发环境配置
    mode: 'development',
    // 开发环境的 output 配置
    output: {}
})

module.exports = webpackConfig
