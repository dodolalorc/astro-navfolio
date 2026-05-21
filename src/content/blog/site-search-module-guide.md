---
title: 'Navfolio 搜索模块使用说明'
description: '了解 Navfolio 如何使用 Pagefind 接入静态全文搜索，以及如何配置顶部导航搜索入口和快捷键。'
date: '2026-05-21'
draft: false
heroImage: '/src/assets/figure/search-hero.png'
showHeroImage: true
tags:
  - Astro
  - Search
  - Pagefind
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---

Navfolio 的搜索模块使用 Pagefind 生成静态索引。它不需要后端服务，也不需要把整站内容提前打包进导航组件；生产构建完成后，搜索脚本会从 `dist/pagefind` 按需加载索引。

## 打开搜索

站点顶部导航里有一个搜索按钮。点击按钮会打开搜索弹层，输入框会立即获得焦点。也可以在任意页面使用快捷键：

- Windows / Linux：`Ctrl+K`
- macOS：`Cmd+K`

按下 `Escape` 会关闭弹层。关闭时，页面会尽量把焦点还给打开搜索前所在的元素，让键盘操作保持连续。

## 配置搜索

搜索相关的用户配置集中在 `src/config/site.toml`：

```toml
[config.search]
enabled = true
shortcut = "mod+k"
placeholder = "Search notes..."
maxResults = 6
```

`enabled` 控制顶部导航是否显示搜索入口。`shortcut` 目前支持 `mod+k`，其中 `mod` 在 Windows 和 Linux 上代表 `Ctrl`，在 macOS 上代表 `Cmd`。`placeholder` 控制输入框提示文案，`maxResults` 控制弹层里最多展示几条结果。

## 构建索引

运行生产构建：

```sh
bun run build
```

这个命令会先执行 Astro 构建，再让 Pagefind 扫描 `dist` 并输出搜索资源到 `dist/pagefind`。索引主要读取页面里的 `<main>` 内容，并忽略带有 `data-pagefind-ignore` 的重复导航和工具区域。

如果在开发服务里还没有生成过生产索引，搜索弹层会提示索引暂不可用。完成一次构建后，可以运行：

```sh
bun run preview
```

然后在预览站点中检查完整搜索体验。

## 内容建议

搜索结果来自页面正文、标题和摘要。为了让结果更清晰，文章 frontmatter 里的 `title` 和 `description` 应保持准确，正文标题也应该尽量表达真实内容，而不是只写装饰性的短句。
