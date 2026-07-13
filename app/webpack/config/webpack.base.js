const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')

// 动态构造 entry 配置和 html-webpack-plugin 配置列表
const pageEntries = {}
const htmlWebpackPluginList = []

// 获取 app/pages 目录下所有入口文件 （entry.xx.js）
const entryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js')
glob.sync(entryList).forEach(item => {
    const entryName = path.basename(item, '.js')
    // 构造 entry
    pageEntries[entryName] = item
    // 构造最终渲染的页面文件
    htmlWebpackPluginList.push(
        // 使用 new 实例化 HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            // 产物（最终模板）输出路径
            filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.tpl'),
            // 要注入的代码块
            chunks: [entryName],
            // 将 script 注入到 head 中
            inject: 'head',
            // 压缩 HTML
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            // 浏览器在请求资源时不发送用户的身份凭证（替代 HtmlWebpackInjectAttributesPlugin）
            scriptLoading: 'defer',
            attributes: {
                crossorigin: 'anonymous',
            },
        })
    )
})



/**
 * 基础配置
 */
module.exports = {
    // 构建模式：production 或 development
    mode: 'production',
    // 入口配置
    entry: pageEntries,
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
        // 公共路径，尾部加 / 确保路径正确
        publicPath: '/dist/prod/',
        // 自动清理旧产物
        clean: true,
        crossOriginLoading: 'anonymous',
    },
    // 配置模块解析的具体行为（定义 webpack 在打包时，如何找到并解析具体模块的路径）
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            $pages: path.resolve(process.cwd(), './app/pages'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $widgets: path.resolve(process.cwd(), './app/pages/widgets'),
            $store: path.resolve(process.cwd(), './app/pages/store'),
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
        ...htmlWebpackPluginList,
    ],
    // 配置打包输出优化（代码分割，模块合并，缓存，TreeShaking，压缩等优化策略）
    optimization: {
        /** 
         * 把 js 文件打包成3种类型
         * 1. vendor： 第三方 lib 库，基本不会改动，除非依赖版本升级
         * 2. common： 业务组件代码的公共部分抽取出来，改动较少
         * 3. entry.{page}: 不用页面 entry 里的业务组件代码的差异部分，会经常改动
         * 目的：把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存的效果
         */ 
        splitChunks: {
            chunks: 'all', // 对同步和异步模块都进行分割
            maxAsyncRequests: 10, // 最大异步请求数，超过10个会进行代码分割
            maxInitialRequests: 10, // 最大初始请求数，超过10个会进行代码分割
            cacheGroups: {
                vendor: { // 第三方依赖库
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',// 模块名称
                    priority: 20, // 优先级，数字越大，优先级越高
                    enforce: true, // 强制执行
                    reuseExistingChunk: true, // 重用已存在的 chunk
                },
                common: { // 公共模块
                    name: 'common', // 模块名称
                    minChunks: 2, // 最小引用次数，超过2次会进行代码分割
                    minSize: 1, // 最小分割文件大小（1 byte）
                    priority: 10, // 优先级，数字越大，优先级越高
                    reuseExistingChunk: true, // 重用已存在的 chunk
                },

            },
        },
        // 将 webpack 运行时生成的代码打包到 runtime.js
        runtimeChunk: true,
    }
}
