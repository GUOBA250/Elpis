const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");

const baseConfig = require("./webpack.base.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 开发环境服务器配置
const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1",
  PORT: 9002,
  HMR_PATH: "__webpack_hmr", // 官方规定的 HMR 路径
  TIMEOUT: 20000,
};

const { HOST, PORT, HMR_PATH, TIMEOUT } = DEV_SERVER_CONFIG;

Object.keys(baseConfig.entry).forEach((v) => {
  if (v !== "vendor") {
    baseConfig.entry[v] = [
      baseConfig.entry[v],
      `${require.resolve('webpack-hot-middleware/client')}?path=http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`,
    ];
  }
});

// 开发环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
  mode: "development",
  // 开发环境 sourcemap
  devtool: "eval-cheap-module-source-map",
  // 开发环境输出
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.resolve(process.cwd(), "./app/public/dist/dev/"),
    publicPath: `http://${HOST}:${PORT}/public/dist/dev/`,
    crossOriginLoading: "anonymous",
    globalObject: "this",
  },
  // 开发环境要做的事情
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [require.resolve("style-loader"), require.resolve("css-loader")],
      },
      {
        test: /\.less$/,
        use: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("less-loader"),
        ],
      },
    ],
  },
  plugins: [
    // 热更新
    new webpack.HotModuleReplacementPlugin({
      multiStep: false,
    }),
    new MiniCssExtractPlugin(),
  ],
});

module.exports = {
  // webpack 配置
  webpackConfig,
  // 开发环境服务器配置，给dev.js使用
  DEV_SERVER_CONFIG,
};
