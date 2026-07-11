/**
 * router-schema loader
 * @param {object} app koa 实例
 * 
 * 通过 'json-schema & ajv' 对 API 规则进行约束， 配合 api-params-verify 中间件使用
 * 
 * app/router-schema/**.js
 */
const path = require('path');
const glob = require('glob');
const sep = path.sep;

module.exports = (app) => {
    const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));
    
    // 注册所有 routerSchema ， 通过 app.routerSchema.${目录}.${文件} 访问每个Schema
    let routerSchema = {}
    fileList.forEach(file => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    })
    app.routerSchema = routerSchema;
}
