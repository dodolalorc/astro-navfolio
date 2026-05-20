---
title: '为 Navfolio 接入可配置评论系统'
description: '记录一次为 Astro 博客主题添加 giscus、utterances 和 Waline 评论系统的过程。'
date: '2026-05-20'
showHeroImage: false
heroImage: '/src/assets/figure/comment-hero.png'
draft: false
comments: true
tags:
  - Astro
  - Navfolio
  - Comment
---

一个安静的个人博客不一定需要评论区，但它需要给读者留下继续说话的可能。Navfolio 的评论系统因此做成了可配置模块：默认服务于文章页，又允许站点维护者按自己的内容节奏关闭它。

## 支持的提供方

当前配置支持四种状态：

- `giscus`：基于 GitHub Discussions，适合已经把讨论沉淀在 GitHub 社区里的站点。
- `utterances`：基于 GitHub Issues，配置简单，适合轻量博客。
- `waline`：支持评论和浏览量统计，适合需要独立服务端能力的站点。
- `none`：完全关闭评论系统。

这些提供方不会被硬编码到文章内容里，而是集中放在站点配置中，方便以后替换。

## 在 site.toml 中切换

评论配置位于 `src/config/site.toml` 的 `config.comments` 模块：

```toml
[config.comments]
enabled = true
provider = "giscus"
show_on_posts = true
```

把 `provider` 改成 `utterances`、`waline` 或 `none` 就能切换模式。对应提供方的详细配置放在各自的子表里，例如：

```toml
[config.comments.giscus]
repo = "owner/repo"
repo_id = "..."
category = "Announcements"
category_id = "..."
mapping = "pathname"
theme = "preferred_color_scheme"
lang = "zh-CN"
```

如果某个提供方缺少必要配置，页面会优雅地不渲染评论区，并在开发环境给出 warning，避免空配置把整篇文章拖垮。

## 单篇文章关闭评论

博客文章的 frontmatter 支持 `comments` 字段：

```yaml
comments: false
```

默认值是 `true`。这意味着普通文章会显示评论区，而公告、归档说明、纯展示页等不适合讨论的内容可以单独关闭。

## Waline 浏览量

Waline 是当前计划里唯一负责浏览量统计的提供方。启用 Waline 并设置 `pageview = true` 后，文章标题下方的 meta 信息会显示浏览量。

giscus 和 utterances 不负责浏览量统计；其中 giscus 的 `emit_metadata` 也不是 pageview 能力，不应该拿来误用。

## 后续可能支持

后续可以继续接入 Twikoo、Artalk 或完全自建的评论服务。只要继续保持“配置集中、组件分发、文章 frontmatter 控制”的结构，评论系统就能随着站点成长，而不打扰正文阅读。
