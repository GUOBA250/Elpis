const path = require("path");
const merge = require("webpack-merge");
const os = require("os");
const HappyPack = require("happypack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

// 多线程 build 设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({
    size: os.cpus().length,
  }),
};

const baseConfig = require("./webpack.base.js");

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
  mode: "production",
  // 生产环境输出
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod/"),
    publicPath: "/dist/prod/",
    crossOriginLoading: "anonymous",
  },
  // 生产环境要做的事情
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          `${require.resolve("happypack/loader")}?id=css`,
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve("css-loader"),
          require.resolve("less-loader"),
        ],
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
        use: [`${require.resolve("happypack/loader")}?id=js`],
      },
    ],
  },
  performance: {
    // 关闭性能提示
    hints: false,
  },
  plugins: [
    // 每次 build 前先删除 dist 目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // 提取 css 公共部分，有效利用缓存
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].bundle.css",
    }),
    // 优化并压缩 css 资源
    new CssMinimizerPlugin(),
    // 多线程打包 js，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `${require.resolve("babel-loader")}?${JSON.stringify({
          presets: [require.resolve("@babel/preset-env")],
          plugins: [require.resolve("@babel/plugin-transform-runtime")],
        })}`,
      ],
    }),
    // 多线程打包 css, 加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // 浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  optimization: {
    // 使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
    // 清除 console.log
    minimize: true,
    minimizer: [
      // 压缩 css
      new TerserWebpackPlugin({
        parallel: true, // 开启多进程压缩
        cache: true, // 开启缓存
        terserOptions: {
          compress: {
            drop_console: true, // 清除 console.log
          },
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
