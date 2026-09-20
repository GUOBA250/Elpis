const webpack = require("webpack");
const webpackProdConfig = require("./config/webpack.prod.js");

module.exports = () => {
  console.log("\n building... \n");

  webpack(webpackProdConfig, (err, stats) => {
    if (err) {
      console.log("err ", err);
      return;
    }
    process.stdout.write(
      stats.toString({
        colors: true, // 使用颜色标识
        modules: false, // 不显示每个模块的打包信息
        children: false, // 不显示子编译任务信息
        chunks: false, // 不显示每个代码块的信息
        chunkModules: true, // 显示代码块中模块的信息
      }) + "\n\n"
    );
  });
};
