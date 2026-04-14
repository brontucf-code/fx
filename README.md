# Finance News Backend (NestJS + Prisma)

面向财经资讯站的 SEO 优先后端系统（第一版），支持文章管理、SEO 元数据、自动发布、Sitemap/News Sitemap/RSS、内容生成接口骨架。

## 技术栈

- Node.js 20+
- NestJS + TypeScript
- Prisma + MySQL
- Redis（预留）
- Swagger
- pnpm

## 启动后地址

- API: `http://localhost:5000/api/v1`
- Health: `http://localhost:5000/api/v1/health`
- Swagger: `http://localhost:5000/api/docs`
- Sitemap: `http://localhost:5000/sitemap.xml`
- News Sitemap: `http://localhost:5000/news-sitemap.xml`
- RSS: `http://localhost:5000/rss.xml`

## 快速开始

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm start:dev
```

## 数据库初始化建议

1. 创建 MySQL 数据库：`finance_news`
2. 执行迁移：`pnpm prisma:migrate`
3. 可选：进入 Prisma Studio 查看数据：`pnpm prisma:studio`

## 已实现模块

- `auth` JWT 登录骨架
- `articles` 文章 CRUD、slug 自动生成、摘要与阅读时长计算、状态流转
- `seo` 自动 canonical + meta + JSON-LD（Article/NewsArticle + Breadcrumb）
- `generation` 关键词生成、改写、FAQ 与内链建议接口
- `publishing` 发布前校验 + 发布动作 + indexingLog 记录
- `scheduler` cron 扫描 scheduledAt 自动发布
- `sitemap` 普通 sitemap + news sitemap（按站点配置可调回溯小时）
- `rss` RSS 输出
- `health/sites` 等基础模块

## 发布接口自动动作

`POST /api/v1/publishing/:articleId/publish`

自动执行：

1. slug 冲突检查
2. SEO 字段完整性检查
3. canonical 自动生成
4. schema 自动生成
5. 发布记录写入 `PublishJob`
6. 索引日志写入 `IndexingLog`

> 说明：Sitemap/News Sitemap/RSS 为实时读取数据库动态生成，不需要额外落盘更新。

## 后续建议

- 对 `categories/tags/sources/authors/media/analytics` 增加完整 CRUD
- 接入 OpenAI/兼容模型 SDK（当前 generation 为可扩展 mock 逻辑）
- 增加角色细粒度权限（RBAC）与审计日志
- 增加内容相似度检测（MinHash / embedding）
- 增加多站点分发表（ArticleSiteDistribution）
