# 贡献指南（Contributing Guide）

感谢你为 Elpis 贡献代码！请先阅读以下规范，以确保贡献流程顺畅。

## 代码风格规范

### 通用要求

- **ESLint 必须通过**：提交前执行 `npm run lint`，确保 0 error（规则见 `.eslintrc`，基于 `plugin:vue/base` + `plugin:vue/recommended`）
- **编码格式**（见 `.editorconfig`）：UTF-8 编码、LF 换行、文件末尾保留空行、去除行尾空格
- **缩进**：JS / Vue 文件 2 空格缩进；HTML / 模板（`.tpl`）4 空格缩进

### 命名规范

| 对象 | 规范 | 示例 |
|------|------|------|
| 后端文件（controller / service / middleware / extend / router） | kebab-case | `api-sign-verify.js` |
| 前端组件目录 | kebab-case | `schema-table/` |
| Vue 组件导入名 | PascalCase | `import SchemaTable from '...'` |
| Vue 模板标签 | kebab-case | `<schema-table />` |
| Pinia store | `useXxxStore` | `useMenuStore` |
| 组合式函数（hook） | `useXxx` | `useSchema` |
| 常量 | UPPER_SNAKE_CASE | `PROJ_KEY_OPTIONAL_PATHS` |

### 注释要求

- 注释统一使用**中文**
- 公共函数 / 类 / 模块使用 JSDoc 风格注释（`@param` / `@returns`），参考 `app/controller/base.js`、`elpis-core/loader/*.js`
- 复杂逻辑（合并策略、路径解析、防抖等）需注释说明意图，而不仅是翻译代码

### Vue 组件要求

- 使用 `<script setup>` 组合式 API
- 对外部注入数据（`inject` / props 回调）做空值防御，参考 `create-form.vue` 的写法
- 定时器、事件监听等资源必须在 `onUnmounted` 中清理

### 提交前自查清单

```bash
npm run lint   # ESLint，0 error
npm test       # mocha 接口测试，7 个用例全部通过
```

## 分支命名与提交信息

### 分支命名

- 主开发分支：`develop`（请基于 `develop` 切出新分支）
- 分支命名：`feature/<简述>`、`fix/<简述>`、`docs/<简述>`、`refactor/<简述>`

```bash
git checkout develop && git pull origin develop
git checkout -b feature/schema-export
```

### 提交信息格式

遵循 Angular 提交规范（仓库在 `package.json` 中通过 ghooks 配置了 `commit-msg: validate-commit-msg` 与 `pre-commit: npm run lint` 钩子校验）：

```
<type>(<scope>): <subject>
```

- **type**（必填）：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore` / `revert`
- **scope**（可选）：影响范围，如 `middleware`、`schema-table`、`webpack`
- **subject**（必填）：一句话描述，使用祈使句、结尾不加句号

示例：

```
feat(middleware): add project-handler for proj_key injection
fix(sider-view): correct schema path typo in pathMap
docs(readme): add troubleshooting section
```

> 注意：使用 pnpm 安装时，依赖的生命周期脚本默认不执行，ghooks 钩子可能未自动安装。无论钩子是否生效，请务必在提交前手动执行 `npm run lint` 与 `npm test`。

## Pull Request 流程

仓库地址：[GUOBA250/Elpis](https://github.com/GUOBA250/Elpis)（主开发分支 `develop`）

1. **Fork 仓库**：在 GitHub 上点击 Fork，将仓库复制到你的账号下

2. **克隆并配置远程**：

   ```bash
   git clone git@github.com:<你的用户名>/Elpis.git
   cd Elpis
   git remote add upstream git@github.com:GUOBA250/Elpis.git
   ```

3. **同步上游并创建功能分支**：

   ```bash
   git fetch upstream
   git checkout -b feature/your-feature upstream/develop
   ```

4. **开发与自测**：完成编码后执行完整自检

   ```bash
   npm run lint   # 必须通过
   npm test       # 必须通过；涉及接口变更时同步更新 test/ 用例
   ```

5. **提交并推送**：

   ```bash
   git add <相关文件>
   git commit -m "feat(xxx): 简述变更"
   git push origin feature/your-feature
   ```

6. **创建 Pull Request**：在 GitHub 上向 `GUOBA250/Elpis` 的 `develop` 分支发起 PR，标题遵循提交信息格式，描述中包含：
   - 变更内容与动机
   - 自测结果（lint / test 输出摘要）
   - 关联的 Issue 编号（如有，格式 `Closes #N`）

7. **代码评审**：维护者评审通过后合并；如需修改，在同一分支追加提交并推送即可（PR 自动更新）

8. **同步主仓库**：合并后删除功能分支，并同步本地 develop：

   ```bash
   git checkout develop
   git pull upstream develop
   git branch -d feature/your-feature
   ```

## Issue 报告模板

提交 Bug 或功能建议时，请按以下模板填写（**前五项必填**）：

```markdown
### 环境（必填）
- 操作系统：
- Node.js 版本：node -v
- 包管理器及版本：pnpm -v
- 代码版本（commit / 分支）：

### 复现步骤（必填）
1. ...
2. ...
3. ...

### 预期行为（必填）
...

### 实际行为（必填）
...

### 附件（可选）
- 完整错误日志 / 控制台输出
- 截图
- 最小可复现示例
```

**Issue 质量要求：**
- 标题用一句话概括问题（如 `[bug] /api/proj/list 返回 446`）
- Bug 类 Issue 必须包含可复现步骤；无法复现的问题请先提供环境与日志
- 功能建议请说明使用场景与期望的配置方式
