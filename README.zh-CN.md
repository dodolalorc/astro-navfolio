<p align="center">
  <img src="./public/images/logo-with-name.png" alt="Navfolio logo with name" width="360" />
</p>

<p align="center">
  一个基于 Astro 的个人导航作品集模板，把个人介绍、常用链接、GitHub 数据、博客、日历、时钟和近期动态整理到一个轻量的响应式主页里。
  <br />
  <sub>正在开发中，功能与视觉细节仍会持续调整。</sub>
</p>

<p align="center">
  <a href="./README.en.md">English</a>
  ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="./public/images/logo.png" alt="Navfolio logo" width="72" />
  &nbsp;&nbsp;
  <img src="./public/images/logo-cat.png" alt="Navfolio cat logo" width="72" />
  &nbsp;&nbsp;
  <img src="./public/images/logo-in-one.png" alt="Navfolio compact logo" width="72" />
</p>

## 预览

<table>
  <tr>
    <th width="50%">Orbit Layout</th>
    <th width="50%">Grid Layout</th>
  </tr>
  <tr>
    <td width="50%">
      <img src="./public/images/orbit-layout.png" alt="Navfolio orbit layout preview" />
    </td>
    <td width="50%">
      <img src="./public/images/grid-layout.png" alt="Navfolio grid layout preview" />
    </td>
  </tr>
</table>

## 项目介绍

Navfolio 取自 Navigation 与 Portfolio。它不是传统的单页简历，而是一个可配置的个人信息入口：你可以把作品集、博客、简历、开源项目、联系方式、状态卡片和近期事项放在同一个首页，让访问者快速了解你是谁、在做什么、可以从哪里继续浏览。

这个项目适合用作：

- 个人主页与导航页
- 开源项目作者的个人入口
- 作品集、博客与简历的聚合首页
- Astro 静态站点 starter

## 功能

- Astro 静态站点，支持 Markdown 和 MDX 博客内容。
- 响应式仪表盘布局，适配桌面端与移动端。
- 首页内容集中配置在 `src/data/profile.ts`。
- 内置个人资料、导航卡片、介绍卡片、GitHub Stats、社交链接、时钟、日历和近期动态。
- 使用 `lucide-astro` 做统一图标适配。
- 支持 RSS、Sitemap 和 GitHub Pages 部署工作流。

## 技术栈

- Astro 6
- Bun
- Tailwind CSS 4
- lucide-astro
- @astrojs/mdx
- @astrojs/rss
- @astrojs/sitemap

## 快速开始

安装依赖：

```sh
bun install
```

启动开发服务器：

```sh
bun run dev
```

构建生产版本：

```sh
bun run build
```

预览生产构建：

```sh
bun run preview
```

## 自定义内容

大部分首页内容都在 `src/data/profile.ts`：

- `profile`：名称、身份、头像、GitHub、邮箱、网站和地区。
- `navigationLinks`：首页导航卡片。
- `quote`：顶部标语与展示图片。
- `intro`：项目或个人介绍卡片。
- `githubStats`：GitHub 数据卡片配置。
- `connectLinks`：社交与联系方式。
- `doingItems`：近期事项或当前关注点。

站点标题和描述位于 `src/consts.ts`。

## 目录结构

```text
public/
  images/                 品牌图、封面图与首页展示图
src/
  components/
    cards/                首页卡片组件
    layout/               仪表盘布局
    widgets/              时钟、日历与动态组件
    Icon.astro            统一图标适配器
  content/blog/           Markdown / MDX 博客文章
  data/profile.ts         首页主要配置
  layouts/                基础布局与博客布局
  pages/                  Astro 路由
  styles/global.css       全局样式
astro.config.mjs          Astro 配置
```

## 部署

这是一个静态 Astro 项目，可以部署到任意支持 Node 或 Bun 构建的平台。

仓库已包含 `.github/workflows/deploy-pages.yml`，可用于 GitHub Pages 自动部署。推荐构建命令：

```sh
bun run build
```

输出目录：

```text
dist
```
