const _ = require("lodash");
const glob = require("glob");
const path = require("path");
const { sep } = path;

/**
  * 数据结构示例：
  [
    {
      model: {
        model: "dashboard",
        name: "电商系统",
        menu: [
          {
            key: "product",
            name: "商品管理",
            menuType: "module",
            moduleType: "custom",
            customConfig: { path: "/todo" },
          },
        ],
        key: "business",
      },
      project: {
        pdd: {
          model: "dashboard",
          name: "拼多多",
          menu: [],
          key: "pdd",
        },
      },
    },
  ]
 */

// project 继承 Model 方法
const projectExtendModel = (model, project) => {
  /**
   * 合并数据 判断数组，按照key合并
   */
  const mergedData = _.mergeWith(
    {},
    model,
    project,
    (modelValue, projValue) => {
      // 数组合并
      if (Array.isArray(modelValue) && Array.isArray(projValue)) {
        let result = [];
        /**
         * 合并规格
         * - 0. 以 model 为基准
         * - 1. project 有的，model 没有的，追加
         * - 2. model 有的，project 没有的，保留
         * - 3. 两者都有的，修改(重载：project覆盖model)
         */

        // 遍历modelValue, 处理修改和保留
        for (let i = 0; i < modelValue.length; i++) {
          const modelItem = modelValue[i];
          const projItem = projValue.find((item) => item.key === modelItem.key);
          result.push(
            // 有projItem, 递归调用 projectExtendModel 继续合并，
            // 没有projItem, 使用modelItem
            projItem ? projectExtendModel(modelItem, projItem) : modelItem
          );
        }

        // 处理追加
        for (let i = 0; i < projValue.length; i++) {
          const projItem = projValue[i];
          const modelItem = modelValue.find(
            (item) => item.key === projItem.key
          );
          if (!modelItem) {
            result.push(projItem);
          }
        }

        return result;
      }
    }
  );
  return mergedData;
};

module.exports = (app) => {
  const modelList = [];
  // 遍历当前文件夹，构造模型数据结构，挂载到 modelList 中
  const modelPath = path.join(app.baseDir, `.${sep}model`);
  const fileList = glob.sync(path.resolve(modelPath, `.${sep}**${sep}**.js`));

  fileList.forEach((file) => {
    // 排除 index.js[自己] 文件
    if (file.indexOf("index.js") > -1) return;
    // 匹配配置类型（model / project）
    const type = file.indexOf(`${sep}project${sep}`) > -1 ? "project" : "model";

    if (type === "project") {
      // 使用 sep 构造正则，兼容 Windows（\）与 POSIX（/）路径分隔符
      const modelKey = file.match(
        new RegExp(`\\${sep}model\\${sep}(.*?)\\${sep}project`)
      )?.[1];
      const projKey = file.match(
        new RegExp(`\\${sep}project\\${sep}(.*?)\\.js`)
      )?.[1];

      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      if (!modelItem) {
        // 初始化 model 对象
        modelItem = {};
        modelList.push(modelItem);
      }
      if (!modelItem.project) {
        // 初始化 project 对象
        modelItem.project = {};
      }
      const projObj = require(path.resolve(file));
      modelItem.project[projKey] = projObj;
      modelItem.project[projKey].key = projKey; // 注入 project key
      modelItem.project[projKey].modelKey = modelKey; // 注入 model key
    }
    if (type === "model") {
      const modelKey = file.match(
        new RegExp(`\\${sep}model\\${sep}(.*?)\\${sep}model\\.js`)
      )?.[1];
      let modelItem = modelList.find((item) => item.model?.key === modelKey);
      if (!modelItem) {
        modelItem = {};
        modelList.push(modelItem);
      }
      const modelObj = require(path.resolve(file));
      modelItem.model = modelObj;
      modelItem.model.key = modelKey; // 注入model key
    }
  });

  // 智能merge数据，project 继承 model
  modelList.forEach((item) => {
    const { model, project } = item;
    if (project && model) {
      for (const key in project) {
        // 合并操作
        project[key] = projectExtendModel(model, project[key]);
      }
    }
  });

  return modelList;
};
