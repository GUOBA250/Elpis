const glob = require("glob");
const path = require("path");
const { sep } = path;
const _ = require("lodash");

/**
 * extend loader
 * @param {Object} app Koa 实例
 * 加载所有extend，可通过’app.${文件}‘的方式访问
 * 例子(extend目录只有一级文件, 不会嵌套多个层级)
  app/extend
  └── custom-extend1.js
  └── custom-extend2.js
  访问方式: app.customExtend1
 *
 */
module.exports = (app) => {
  // 读取 elpis/app/extend 目录下的所有文件
  const elpisExtendPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}extend`
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisExtendPath, `.${sep}**${sep}**.js`)
  );
  elpisFileList.forEach((file) => handleFile(file));

  // 读取 业务/app/extend 目录下的所有文件
  const bussinessExtendPath = path.resolve(app.bussinessPath, `.${sep}extend`);
  const bussinessFileList = glob.sync(
    path.resolve(bussinessExtendPath, `.${sep}**${sep}**.js`)
  );
  bussinessFileList.forEach((file) => handleFile(file));

  function handleFile(file) {
    // 例：/Users/xxx/Documents/elpis/elpis/app/extend/modules/a/b/custom.js
    let name = path.resolve(file);
    // 截取app/extend后面的路径 => modules/a/b/custom
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf(".")
    );
    // 转成驼峰格式（对每个路径段单独转换）
    name = name.split(sep).map(s => _.camelCase(s)).join(sep);

    // 过滤app上重复的key
    for (const key in app) {
      if (key === name) {
        console.log(`[extend load error] name:${name} is already exist in app`);
        return;
      }
    }

    // 挂载 extend 到 app 上
    app[name] = require(path.resolve(file))(app);
  }
};
