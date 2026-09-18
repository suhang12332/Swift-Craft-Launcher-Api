# Swift Craft Launcher API

Cloudflare Pages 反向代理，用于在国内访问 Swift Craft Launcher 的 Workers 服务。

## 项目结构

```
├── public/
│   └── index.html
├── functions/
│   └── api/
│       ├── contributors.js
│       ├── update.js
│       └── download.js
└── package.json
```

## 路由

| Pages 路径 | Worker |
|---|---|
| `/api/contributors` | `swift-craft-launcher-contributors.workers.dev` |
| `/api/update/*` | `swift-craft-launcher-update.workers.dev` |
| `/api/download/*` | `swift-craft-launcher-download.workers.dev` |

## 部署

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Pages
wrangler pages deploy public
```

## 本地开发

```bash
npm run dev
```