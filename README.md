# Mahiro Frontend — 短链服务前端

基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia 的短链服务前端。

本仓库包含两个版本，通过分支区分：

| 分支 | 说明 | 线上地址 |
|------|------|----------|
| `main` | 旧版前端，带用户系统（注册/登录/我的短链） | https://tinyurl.mahiro.cloud/legacy/ |
| `new-tinyurl` | 新版前端，无登录，极简短链生成 | https://tinyurl.mahiro.cloud/ |

## 技术栈

- **框架**：Vue 3（`<script setup>`）+ TypeScript
- **构建**：Vite 7
- **UI**：Element Plus + @element-plus/icons-vue
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP**：Axios

## 功能特性

### main 分支（旧版）

- 用户注册 / 登录（JWT）
- 创建短链（支持自定义短码、过期天数）
- 我的短链列表（分页）
- 短链访问统计
- 401 自动跳转登录

### new-tinyurl 分支（新版）

- 单页短链生成
- 无用户系统，开箱即用

## 本地开发

### 环境要求

- Node.js >= 18
- pnpm / npm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

旧版前端（main）默认通过 `/api` 前缀请求后端，需配合后端服务运行。
开发环境通过 Vite 代理转发到本地后端（见 `vite.config.ts`）。

## 环境变量

新建 `.env.local` 或 `.env.production`：

```
# API 基础地址
VITE_API_BASE_URL=
```

- 开发环境：留空，走 Vite 代理
- 生产环境：留空，使用同源（同域名下 Nginx 转发）

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

- `main` 分支构建时 `base` 设为 `/legacy/`，部署在子路径下
- `new-tinyurl` 分支构建时 `base` 为根路径

## 部署

生产环境由 Nginx 统一托管，参考 `nginx-dual-site.conf`：

- 新前端（`new-tinyurl` 构建产物）→ `/`
- 旧前端（`main` 构建产物）→ `/legacy/`
- 新版后端 → `:8080`（`/shorten`、`/s/`、`/healthz`）
- 旧版后端 → `:8081`（`/api/`、短链跳转）

```bash
# 打包
npm run build

# 上传到服务器对应目录
# 新前端 → /home/frontend/tinyurl-new-dist/
# 旧前端 → /home/frontend/tinyurl-old-dist/
```

## 项目结构（main 分支）

```
src/
├── api/           # Axios 封装与接口定义
│   └── index.ts
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
│   └── index.ts
├── stores/        # Pinia 状态
│   └── user.ts
├── views/         # 页面组件
│   ├── Home.vue
│   ├── Login.vue
│   ├── MyLinks.vue
│   └── Register.vue
├── App.vue
├── main.ts
└── style.css
```

## 接口说明（main 分支）

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/api/register` | 注册 | 否 |
| POST | `/api/login` | 登录 | 否 |
| POST | `/api/shorten` | 创建短链 | 是 |
| GET | `/api/my-links` | 我的短链 | 是 |
| GET | `/api/stats/:short` | 短链统计 | 否 |

## License

MIT
