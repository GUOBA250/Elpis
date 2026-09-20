const glob = require("glob");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");

// 动态构造 elpis 页面入口和输出配置
const elpisPageEntries = {};
const elpisHtmlWebpackPluginList = [];
// 获取 elpis/app/pages 目录下所有入口文件 entry.[pageName].js
const elpisEntryList = path.resolve(__dirname, "../../pages/**/entry.**.js");
glob
  .sync(elpisEntryList)
  .forEach((file) =>
    handleFile(file, elpisPageEntries, elpisHtmlWebpackPluginList)
  );

// 动态构造 业务 页面入口和输出配置
const businessPageEntries = {};
const businessHtmlWebpackPluginList = [];
// 获取 business/app/pages 目录下所有入口文件 entry.[pageName].js
const businessEntryList = path.resolve(
  process.cwd(),
  "./app/pages/**/entry.**.js"
);
glob
  .sync(businessEntryList)
  .forEach((file) =>
    handleFile(file, businessPageEntries, businessHtmlWebpackPluginList)
  );

// 构造相关 webpack 处理数据结构
function handleFile(file, entrys = {}, pluginList = []) {
  const entryName = path.basename(file, ".js");
  // 生成webpack的入口entry配置
  entrys[entryName] = file;
  // 构造最终的渲染页面文件
  pluginList.push(
    new HtmlWebpackPlugin({
      // 产物（最终模板）输出路径
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.tpl`
      ),
      // 指定要使用的模板文件
      template: path.resolve(__dirname, "../../view/entry.tpl"),
      // 要注入的代码块
      chunks: [entryName],
    })
  );
}

// 加载用户 自定义 业务webpack配置
let businessWebpackConfig = {};
try {
  businessWebpackConfig = require(`${process.cwd()}/app/webpack.config.js`);
} catch (error) {}

/**
 * webpack 基础配置
 */
module.exports = merge.smart(
  {
    // 入口
    entry: Object.assign({}, elpisPageEntries, businessPageEntries),
    // 输出
    output: {},
    // 模块解析配置（解析什么模块，用什么方式解析）
    module: {
      rules: [
        {
          test: /\.vue$/,
          // 不能 exclude node_modules，eplis发布到npm，最终安装在node_modules,exclude导致编译失败
          // exclude: /node_modules/,
          use: {
            loader: require.resolve("vue-loader"),
          },
        },
        {
          test: /\.js$/,
          include: [
            // 只对业务代码进行babel，加快webpack编译速度
            // 处理 elpis 目录
            path.resolve(__dirname, "../../pages"),
            // 处理 业务 目录
            path.resolve(process.cwd(), "./app/pages"),
          ],
          use: {
            loader: require.resolve("babel-loader"),
          },
        },
        {
          /**
           * 匹配 png、jpg、jpeg、gif 格式图片
           * 例：image.png、graphic.gif?v=2等
           */
          test: /\.(png|jpe?g|gif)(\?.+)?$/,
          use: {
            loader: require.resolve("url-loader"),
            options: {
              // 小于1kb的图片，将图片转换成base64格式
              limit: 1024,
              esModule: false,
            },
          },
        },
        {
          // 字体文件处理
          test: /\.(woff|woff2|eot|ttf|otf)(\?\S*)?$/,
          use: require.resolve("file-loader"),
        },
      ],
    },
    // 配置模块解析的具体行为（定义webpack在打包时，如何找到并解析具体模块的路径）
    resolve: {
      extensions: [".js", ".vue", ".less", ".css"],
      alias: (() => {
        const aliasMap = {};
        const blankModulePath = path.resolve(__dirname, "../libs/blank.js");
        // elpis 核心前端页面根目录
        const elpisPagesRoot = path.resolve(__dirname, "../../pages");

        /**
         * 解析业务扩展配置路径：
         * - 业务文件存在且不与 elpis 核心文件重复时，返回业务文件路径
         * - standalone 场景（业务路径与核心路径为同一文件）或文件不存在时，返回空模块，
         *   避免核心配置文件通过 $business* 别名 import 自身形成循环引用
         */
        const resolveBusinessConfigPath = (businessPath, elpisPath) => {
          if (businessPath === elpisPath) {
            return blankModulePath;
          }
          return fs.existsSync(businessPath) ? businessPath : blankModulePath;
        };

        const businessDashboardRouterConfig = path.resolve(
          process.cwd(),
          "./app/pages/dashboard/router.js"
        );
        const isExist = fs.existsSync(businessDashboardRouterConfig);
        aliasMap["$businessDashboardRouterConfig"] = isExist
          ? businessDashboardRouterConfig
          : blankModulePath;

        // schema-view Component 扩展配置
        aliasMap["$businessComponentConfig"] = resolveBusinessConfigPath(
          path.resolve(
            process.cwd(),
            "./app/pages/dashboard/complex-view/schema-view/components/component-config.js"
          ),
          path.resolve(
            elpisPagesRoot,
            "./dashboard/complex-view/schema-view/components/component-config.js"
          )
        );

        // schema-form component 扩展配置
        aliasMap["$businessFormItemConfig"] = resolveBusinessConfigPath(
          path.resolve(
            process.cwd(),
            "./app/pages/widgets/schema-form/form-item-config.js"
          ),
          path.resolve(elpisPagesRoot, "./widgets/schema-form/form-item-config.js")
        );

        // schema-search-bar 扩展配置
        aliasMap["$businessSearchItemConfig"] = resolveBusinessConfigPath(
          path.resolve(
            process.cwd(),
            "./app/pages/widgets/schema-search-bar/search-item-config.js"
          ),
          path.resolve(
            elpisPagesRoot,
            "./widgets/schema-search-bar/search-item-config.js"
          )
        );

        const businessHeaderConfig = path.resolve(
          process.cwd(),
          "./app/pages/widgets/header-container/header-config.js"
        );
        aliasMap["$businessHeaderConfig"] = fs.existsSync(businessHeaderConfig)
          ? businessHeaderConfig
          : blankModulePath;

        return {
          vue: require.resolve("vue"),
          "@babel/runtime/helpers/asyncToGenerator": require.resolve(
            "@babel/runtime/helpers/asyncToGenerator"
          ),
          "@babel/runtime/regenerator": require.resolve(
            "@babel/runtime/regenerator"
          ),
          $elpisPages: path.resolve(__dirname, "../../pages"),
          // 工具库
          $elpisCommon: path.resolve(__dirname, "../../pages/common"),
          $elpisCurl: path.resolve(__dirname, "../../pages/common/curl.js"),
          $elpisUtils: path.resolve(__dirname, "../../pages/common/utils.js"),
          // 元件
          $elpisWidgets: path.resolve(__dirname, "../../pages/widgets"),
          $elpisHeaderContainer: path.resolve(
            __dirname,
            "../../pages/widgets/header-container/header-container.vue"
          ),
          $elpisSiderContainer: path.resolve(
            __dirname,
            "../../pages/widgets/sider-container/sider-container.vue"
          ),
          $elpisSchemaTable: path.resolve(
            __dirname,
            "../../pages/widgets/schema-table/schema-table.vue"
          ),
          $elpisSchemaForm: path.resolve(
            __dirname,
            "../../pages/widgets/schema-form/schema-form.vue"
          ),
          $elpisSchemaSearchBar: path.resolve(
            __dirname,
            "../../pages/widgets/schema-search-bar/schema-search-bar.vue"
          ),
          // 缓存别名
          $elpisStore: path.resolve(__dirname, "../../pages/store"),
          // 启动文件 别名
          $elpisBoot: path.resolve(__dirname, "../../pages/boot.js"),
          // 扩展路由
          ...aliasMap,
        };
      })(),
    },
    // 配置 webpack 插件
    plugins: [
      // 处理 .vue 文件，这个插件是必须的
      // 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
      // 例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
      new VueLoaderPlugin(),
      // 把第三方库暴露到 window context 下
      new webpack.ProvidePlugin({
        Vue: "vue",
        axios: "axios",
        _: "lodash",
      }),
      // 定义全局变量
      new webpack.DefinePlugin({
        // 在 vue3 中，支持选项式api
        __VUE_OPTIONS_API__: true,
        //禁用生成环境 Vue 调试工具
        __VUE_PROD_DEVTOOLS__: false,
        // 禁用生产环境显示“水合”信息
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
      // 构造最终渲染的页面模板
      ...elpisHtmlWebpackPluginList,
      ...businessHtmlWebpackPluginList,
    ],
    // 配置 webpack 优化（代码分割，模块合并，缓存，treeShaking，压缩等优化策略）
    optimization: {
      /**
       * 分包策略
       * 把 js 文件打包成3种类型
       * 1. vendor：第三方库，基本不会改动，除非依赖版本升级
       * 2. common：业务代码中，公共的模块，改动较少
       * 3. entry.{page}: 不同页面 entry 里的业务代码组件代码的差异部分，会经常改动
       * 目的: 把较少改动的代码单独打包，减少重复代码，充分利用浏览器缓存，提高加载速度
       */
      splitChunks: {
        chunks: "all", // 对异步和非异步模块都进行分割
        maxAsyncRequests: 10, // 按需加载时的最大并行请求数
        maxInitialRequests: 10, // 入口点的最大并行请求数
        cacheGroups: {
          // 第三方依赖库
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor", // 模块名称
            priority: 20, // 优先级
            enforce: true, // 强制执行
            reuseExistingChunk: true, // 复用已有的公共模块
          },
          // 公共模块
          common: {
            test: /[\\/]common|widgets[\\/]/,
            name: "common", // 模块名称
            minChunks: 2, // 最小引用次数，被引用2次以上才会被打包
            minSize: 1, // 最小分割文件大小(10kb)
            priority: 10, // 优先级
            reuseExistingChunk: true, // 复用已有的公共模块
          },
        },
      },
      // webpack 运行时注入的代码，单独提出来
      runtimeChunk: true,
    },
  },
  businessWebpackConfig
);
