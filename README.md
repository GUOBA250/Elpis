# Elpis

**一个企业级全栈应用框架（Koa2 + Vue3），通过 model / schema 配置驱动仪表板页面与通用 CRUD 组件的快速搭建。**

## 核心功能

- **服务端框架（elpis-core）**：约定式目录加载器（config / router / router-schema / controller / service / middleware / extend），开箱即用的 Koa2 启动器
- **schema 驱动的前端组件**：`schema-table`（表格）、`schema-form`（表单）、`schema-search-bar`（搜索栏）及动态组件（create-form / edit-form / detail-panel），全部由 JSON Schema 配置渲染
- **模型 / 项目双层配置**：`model`（模板）与 `project`（项目）配置递归合并，支持多项目、多仪表板
- **API 安全链路**：MD5 签名校验（`api-sign-verify`）+ JSON-Schema 参数校验（`api-params-verify`）+ 项目隔离中间件（`project-handler`）
- **页面渲染与工程化**：nunjucks 模板注入（projKey / env / options）+ webpack 多入口构建与 dev server 热更新

## 环境要求

| 项 | 要求 |
|---|---|
| Node.js | ≥ 18（开发验证版本：v24.14.1） |
| 包管理器 | pnpm ≥ 10（仓库提供 `pnpm-lock.yaml`） |
| 操作系统 | macOS / Linux（Windows 未验证） |
| 数据库 | 无强制依赖（默认内存模型配置；可选 `db` 配置接入 knex） |

## 安装与运行

```bash
# 1. 克隆仓库
git clone git@github.com:GUOBA250/Elpis.git
cd Elpis

# 2. 安装依赖
pnpm install

# 3. 启动前端构建服务（webpack dev server，端口 9002，需保持运行）
node ./app/webpack/dev.js

# 4. 新开终端，启动后端服务（Koa，默认端口 8080）
_ENV='local' node -e "require('./index.js').serverStart({ name: 'Elpis', homePage: '/view/dashboard' })"

# 5. 浏览器访问
# http://127.0.0.1:8080/view/dashboard?proj_key=dashboard
```

> 后端成功启动时会输出 `Server Listening on 0.0.0.0:8080`；前端编译成功时会输出 `webpack ... compiled successfully`。

### 常用命令

```bash
npm test       # 运行 mocha 接口测试（test/**/*.js，7 个用例）
npm run lint   # ESLint 检查（js/vue，0 error 为通过）
```

## 使用示例

### 场景一：调用项目 API（带签名）

所有 `/api/*` 接口需要签名头：`s_t`（毫秒时间戳，10 分钟内有效）与 `s_sign = md5(signKey + '_' + s_t)`。

**输入：**

```bash
ST=$(date +%s)000
SIGN=$(node -e "console.log(require('md5')('fe7f165ec0314deea95fd9d391800c0c_' + $ST))")
curl -H "s_t: $ST" -H "s_sign: $SIGN" "http://127.0.0.1:8080/api/proj/model_list"
```

**预期输出：**

```json
{"success":true,"data":[{"model":{"key":"dashboard","name":"通用仪表板","desc":"Elpis 框架内置的通用仪表板模型"},"project":{"dashboard":{"key":"dashboard","name":"示例项目","desc":"Elpis 框架内置示例项目","homePage":"/view/dashboard","modelKey":"dashboard"}}}],"metadata":{}}
```

不带签名头访问同一接口时，预期返回：

```json
{"success":false,"message":"signature not correct!!!","code":445}
```

### 场景二：访问仪表板页面

**输入：**

```bash
curl -i "http://127.0.0.1:8080/view/dashboard?proj_key=dashboard"
```

**预期输出：** `HTTP/1.1 200 OK`，返回 HTML，其中注入了项目标识与环境变量：

```html
<title>Elpis</title>
...
<input id="projKey" value="dashboard" style="display: none" />
<input id="env" value="local" style="display: none" />
```

访问不存在的页面（如 `/view/nonexistent`）时，预期返回 `302` 并重定向到 `homePage`（默认 `/view/dashboard`）。

### 场景三：以库方式启动自定义服务

```js
// start.js（仓库根目录）
const { serverStart } = require("./index.js");

const app = serverStart({
  name: "MyApp",            // 应用名，注入页面 title
  homePage: "/view/dashboard", // 未匹配路由 / 模板缺失时的重定向目标
});
```

```bash
_ENV='local' node start.js
# 预期输出：Server Listening on 0.0.0.0:8080
```

## API 一览

| 方法 | 路径 | 说明 | 是否需签名 | proj_key |
|------|------|------|-----------|----------|
| GET | `/view/:page` | 渲染页面（nunjucks 模板） | 否 | 可选（query） |
| GET | `/api/proj?proj_key=xxx` | 项目详情 | 是 | query 必填 |
| GET | `/api/proj/list` | 项目列表（带 `proj_key` 时按同模型过滤） | 是 | 可选 |
| GET | `/api/proj/model_list` | 模型 / 项目结构化数据 | 是 | 无需 |

**错误码约定**（响应 HTTP 状态均为 200，以 `code` 区分）：

| code | 含义 | 触发场景 |
|------|------|----------|
| 445 | 签名校验失败 | 缺失 / 伪造签名、时间戳过期（>600s）或为未来时间 |
| 442 | 参数校验失败 | 不符合 router-schema 定义（如缺少必填 `proj_key`） |
| 446 | 缺少项目标识 | `/api/proj/*` 业务接口未携带 `proj_key`（header 优先，query 兜底） |
| 50000 | 业务或服务异常 | 项目不存在、运行时异常兜底 |

## 配置说明

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `_ENV` | `local` | 运行环境：`local` / `beta` / `production`，决定加载哪份环境配置 |
| `PORT` | `8080` | 后端服务端口 |
| `IP` | `0.0.0.0` | 后端监听地址 |

### 配置文件（`config/config.default.js`）

框架通过 `app.config` 暴露配置，业务可追加任意自定义字段；当前框架消费的字段如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `apiSignVerify.signKey` | `string` | API 签名密钥，**必须与前端 `app/pages/common/curl.js` 中的 signKey 一致**；生产环境建议在 `config.prod.js` 中覆盖并轮换 |
| `apiSignVerify.whiteList` | `string[]` | 免签名校验的路径白名单 |
| `db` | `object` | 可选。knex 连接配置；配置后 `app.database` 即为 knex 实例（见 `app/extend/database.js`），不配置则跳过 |

环境差异化配置：`config/config.local.js`、`config/config.beta.js`、`config/config.prod.js` 会按 `_ENV` 覆盖默认配置（文件不存在时跳过）。

### `serverStart(options)` 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `'Elpis'` | 应用名（注入页面 title） |
| `homePage` | `string` | `/` | 路由兜底与模板缺失时的重定向目标 |
| `baseDir` | `string` | `process.cwd()` | 项目根目录 |
| `bussinessPath` | `string` | `./app` | 业务代码目录 |
| `listen` | `boolean` | `true` | `false` 时不监听端口（用于测试，配合 `supertest(app.callback())`） |

### model / project 配置结构

模型放在 `model/<modelKey>/model.js`，项目放在 `model/<modelKey>/project/<projKey>.js`（项目配置自动继承并合并模型配置）：

```javascript
// model/dashboard/model.js
module.exports = {
  mode: "dashboard",          // 模板类型
  name: "通用仪表板",          // 名称
  desc: "描述",
  icon: "el-icon-setting",
  homePage: "/view/dashboard",
  menu: [
    {
      key: "menu-key",        // 菜单唯一标识
      name: "菜单名称",
      menuType: "group",      // group（有子菜单）/ module
      subMenu: [],            // menuType === group 时的子菜单（结构同 menu）
      // ---- menuType === module 时 ----
      moduleType: "schema",   // sider / iframe / custom / schema
      siderConfig: { menu: [] },   // moduleType === sider
      iframeConfig: { path: "" },  // moduleType === iframe
      customConfig: { path: "" },  // moduleType === custom
      schemaConfig: {             // moduleType === schema
        api: "/api/xxx",          // 数据源 API（RESTful）
        schema: {
          type: "object",
          properties: {
            fieldKey: {
              type: "string",
              label: "字段中文名",
              tableOption: { visible: true, toFixed: 2 }, // 表格列配置
              searchOption: { comType: "input", default: "" }, // 搜索项配置
              createFormOption: { comType: "input", required: true }, // 创建表单
              editFormOption: { comType: "input" },   // 编辑表单
              detailPanelOption: {},                  // 详情面板
            },
          },
          required: [],
        },
        tableConfig: {
          headerButtons: [{ label: "按钮", eventKey: "事件key", eventOption: {} }],
          rowButtons: [{ label: "按钮", eventKey: "事件key", eventOption: { comName: "" } }],
        },
        searchConfig: {},
        componentConfig: {
          createForm: { title: "新建", saveBtnText: "保存" },
          editForm: { title: "编辑", saveBtnText: "保存", mainKey: "id" },
          detailPanel: { title: "详情", mainKey: "id" },
        },
      },
    },
  ],
};
```

### 扩展点目录

| 扩展类型 | 位置 | 注册方式 |
|----------|------|----------|
| 页面入口 | `app/pages/<page>/entry.<page>.js` | webpack 自动扫描构建 |
| schema-view 动态组件 | `app/pages/dashboard/complex-view/schema-view/components/` | `component-config.js` |
| schema-form 控件 | `app/pages/widgets/schema-form/complex-view/` | `form-item-config.js` |
| schema-search-bar 控件 | `app/pages/widgets/schema-search-bar/complex-view/` | `search-item-config.js` |
| 模型 / 项目配置 | `model/<modelKey>/` | 目录约定自动加载 |

## 常见问题排查（Troubleshooting）

### 1. 页面白屏，控制台报 `ERR_CONNECTION_REFUSED`（指向 `127.0.0.1:9002`）

**原因**：开发模式下页面引用的 JS bundle 由 webpack dev server（端口 9002）提供，只启动了后端（8080）而未启动前端构建服务。

**解决**：

```bash
node ./app/webpack/dev.js
# 看到 "webpack dev server running at http://127.0.0.1:9002" 与 "compiled successfully" 后刷新页面
```

### 2. 接口返回 `{"success":false,"code":445,"message":"signature not correct!!!"}`

**原因**：签名缺失或无效。校验规则：`s_t` 必须为**毫秒**时间戳且在 10 分钟内（未来时间戳同样被拒绝）；`s_sign` 必须等于 `md5(signKey + '_' + s_t)`；`signKey` 需与服务端 `config/config.default.js` 中的 `apiSignVerify.signKey` 一致。

**解决**：按「使用示例 · 场景一」生成签名头；若自行修改过 signKey，请确认前后端一致。

### 3. 接口返回 `{"success":false,"code":446,"message":"缺少proj_key"}`

**原因**：`/api/proj/*` 业务接口需要项目标识（请求头 `proj_key` 优先，query 参数兜底）；`/api/proj/list` 与 `/api/proj/model_list` 为发现类接口，已豁免。

**解决**：请求时携带 `proj_key`（header 或 query）；页面访问需在 URL 上带 `?proj_key=xxx`。

### 4. 后端启动报端口占用（`EADDRINUSE` / `[server error] listen EADDRINUSE ... 8080`）

**原因**：8080 已被占用（常见于上一次服务未退出，或 mocha 测试与开发服务冲突）。

**解决**：

```bash
lsof -ti :8080 | xargs kill -9      # 释放端口
PORT=8081 node -e "require('./index.js').serverStart({ name: 'Elpis' })"  # 或换端口启动
```

### 5. 生产构建报 `isRegExp is not a function`

**已知问题**：`frontendBuild('production')`（`app/webpack/config/webpack.prod.js`）因 `clean-webpack-plugin@0.1.19` 与 webpack 5 不兼容，当前不可用；开发模式（`node ./app/webpack/dev.js`）不受影响。

## License

ISC
