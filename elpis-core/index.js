const { log } = require('console');
const Koa = require('koa');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杠 

const env = require('./env');

const middlewareLoader = require('./loader/middleware');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller');
const serviceLoader = require('./loader/service');
const extendLoader = require('./loader/extend');
const configLoader = require('./loader/config');
const routerSchemaLoader = require('./loader/router-schema');



module.exports = {
    /**
     * 启动应用
     * @param {object} options 应用配置
     * options = {
     *     name // 项目名称
     *     homePath // 项目首页
     * }
     */
    start(options = {}) {

        // 创建 Koa 实例
        const app = new Koa();

        //应用配置
        app.options = options;

        //基础路径
        app.baseDir = process.cwd();

        //业务文件路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);

        //初始化环境配置
        app.env = env(app);

        //加载中间件
        middlewareLoader(app);

        //加载控制器
        controllerLoader(app);

        //加载服务
        serviceLoader(app);

        //加载扩展
        extendLoader(app);

        //加载配置
        configLoader(app);

        // 注册全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app);
        }catch (e) {
            console.error('注册全局中间件失败', e);
        }

        //加载路由模式
        routerSchemaLoader(app);

        //加载路由
        routerLoader(app);

        //启动服务
        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || '0.0.0.0';
            app.listen(port, host)
            console.log(`Server runnin on port: ${port}`);
        } catch (e) {
            console.error(e);
        }
    }
};



