const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')



/**
 * 基础配置
 */
module.exports = {
    // 入口配置
    entry: {
        'entry.page1': './app/pages/page1/entry.page1.js',
        'entry.page2': './app/pages/page2/entry.page2.js',
    },
    // 模块解析配置（决定了要加载解释哪些模块，以及用什么方式去解释）
    module: {
        rules: [{
            test: /\.vue$/,
            use: {
                loader: 'vue-loader',
            }
        }, {
            test: /\.js$/,
            include: [
                // 只对业务代码进行 babel，加快 webpack 打包速度
                path.resolve(process.cwd(), './app/pages'),
            ],
            use: {
                loader: 'babel-loader',
            }
        }, {
            test: /\.(png|jpe?g|gif)(\?.+)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 300,
                    esModule: false
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            use: 'file-loader'
        }]
    },
    // 产物输出路径
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous',
    },
    // 配置模块解析的具体行为（定义 webpack 在打包时，如何找到并解析具体模块的路径）
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            $pages: path.resolve(process.cwd(), './app/pages'),
        },
    },
    // 配置 webpack 插件
    plugins: [
        // 处理 .vue 文件，这个插件是必须的
        // 它的职能是将你定义过的其他规则复制并应用到 .vue 文件中
        // 例如，如果有一条匹配规则是 /\.js$/,，那么它会将 .vue 文件中的 js 代码也应用到这个规则中
        new VueLoaderPlugin(),
        // 把第三方库暴露到 window context 下
        new webpack.ProvidePlugin({
            Vue: 'vue',
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'true', //支持 vue 解析 options api
            __VUE_PROD_DEVTOOLS__: 'false', //关闭 vue 开发模式
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', //关闭 vue 模板匹配详情
        }),
        // 构造最终渲染的页面模板
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page1.tpl'),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: [ 'entry.page1' ],
        }),
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page2.tpl'),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: [ 'entry.page2' ],
        }),
    ],
    // 配置打包输出优化（代码分割，模块合并，缓存，TreeShaing，压缩等优化策略）
    optimization: {}
}
