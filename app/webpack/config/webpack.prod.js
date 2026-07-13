const merge = require('webpack-merge')
const path = require('path')
const os = require('os')
const HappyPack = require('happypack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')


// 多线程 build 设置
const happypackCommonConfig = {
    debug: false,
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length })
}

// webpack 5 兼容：使用 thread-loader 替代 HappyPack 的 loader 调用
const threadLoaderOptions = {
    workers: os.cpus().length,
    workerParallelJobs: 50,
    poolRespawn: false,
}

// 基类配置
const baseConfig = require('./webpack.base.js')

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
    // 生产环境配置
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'thread-loader', options: threadLoaderOptions },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    }
                ],
            }, {
                test: /\.js$/,
                include: [
                    // 只对业务代码进行 babel，加快 webpack 打包速度
                    path.resolve(process.cwd(), './app/pages'),
                ],
                use: [
                    { loader: 'thread-loader', options: threadLoaderOptions },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime'],
                        }
                    }
                ]
            }
        ]
    },
    // webpack 不会有大量 hints 信息，默认为warning
    performance: {
        hints: false,
    },
    plugins: [
        // 每次 build 前，清空 public/dist 目录
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(process.cwd(), './app/public/dist')],
            verbose: true,
        }),
        // 提取公共 css,有效利用缓存 （非公共部分使用inline）
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
        }),
        // 优化并压缩 css 资源
        new CSSMinimizerPlugin(),
    ],
    optimization: {
        // 使用 TeserPlugin 的并发和缓存，提升压缩阶段的性能
        // 清除 console.log 等调试代码
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true, // 启用缓存来加速构建过程
                parallel: true, // 利用多核 CPU 的优势来加快压缩速度
                terserOptions: {
                    compress: {
                        drop_console: true, // 移除 console.log 等调试代码
                        drop_debugger: true, // 移除 debugger 语句
                    }
                }
            }),
        ]
    },
    // 生产环境的 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous'
    },

})

module.exports = webpackConfig
