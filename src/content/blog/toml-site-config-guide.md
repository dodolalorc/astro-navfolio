---
title: '用 TOML 管理站点信息'
description: '了解 navfolio 如何把站点标题、个人资料、导航入口和首页模块集中到 src/config/site.toml 中维护。'
date: '2026-05-19T18:00:00+08:00'
heroImage: '/src/assets/figure/toml.png'
showHeroImage: true
draft: false
tags:
  - Astro
  - TOML
  - Configuration
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---

navfolio 的文章内容仍然由 Markdown / MDX 管理，但站点本身还有另一类数据：站点标题、个人资料、顶部导航、首页介绍、身份链接、联系方式和最近关注事项。

这些内容不适合继续散落在组件或多个 TypeScript 变量里。现在它们集中在 `src/config/site.toml` 中，并通过 Astro Content Layer 读取、校验和分发。

## 为什么使用 TOML

TOML 适合描述站点级配置，因为它比 JSON 更适合人工编辑，又比自由格式的 Markdown 更稳定。对于 navfolio 这样的个人站点，它有几个直接好处：

- 配置项可以按模块分组，例如 `site`、`profile`、`topNav`、`home`。
- 数组表适合维护导航、联系方式、最近事项这类可重复条目。
- Astro 可以通过 `file()` loader 原生读取 `.toml` 数据文件。
- 配置结构可以在 `src/content.config.ts` 中用 Zod schema 校验，避免字段漏写后构建才出现隐蔽错误。

## 文件位置

站点配置入口是：

```bash
src/config/site.toml
```

Astro 的集合定义在：

```bash
src/content.config.ts
```

页面和组件通过这个 helper 读取配置：

```bash
src/data/site.ts
```

## 顶层结构

为了让 Astro 的 `file()` loader 把整份配置当成一个数据入口，TOML 文件使用 `config` 作为根对象：

```toml
[config.site]
title = "navfolio"
description = "A personal navigation portfolio starter built with Astro."
pageTitle = "navfolio | Digital Publication Space"
pageDescription = "A calm AI-native personal publication space for notes, links, and writing."
repository = "https://github.com/dodolalorc/astro-navfolio"
footerNote = "Released as an open-source starter."
```

对应的内容集合名称是 `siteConfig`，入口 id 是 `config`。这意味着代码里读取的是同一份完整配置：

```ts
import { getEntry } from 'astro:content';

const entry = await getEntry('siteConfig', 'config');
```

项目已经把这段读取逻辑封装在 `getSiteConfig()` 中，日常使用不需要在组件里直接调用 `getEntry()`。

## 个人资料

`profile` 保存站点作者和头像信息，会被首页 Profile 卡片、文章作者卡片、页脚社交链接等位置复用：

```toml
[config.profile]
name = "navfolio"
handle = "@navfolio"
role = "A Cat Developer"
company = "Independent Studio"
location = "Remote"
email = "hello@navfolio.site"
website = "https://astro.navfolio.site/"
github = "https://github.com/navfolio"
meta = "Open-source maintainer"
avatar = "/images/logo.png"
```

如果你要替换成自己的站点，通常优先修改这里。

## 顶部导航

顶部导航使用数组表，每一个 `[[config.topNav.links]]` 都是一条导航：

```toml
[[config.topNav.links]]
label = "Blog"
href = "/blog"
```

`href` 可以是站内路径，也可以是完整外链。站内路径会由组件自动加上 Astro 的 `base`，因此部署到 GitHub Pages 子路径时仍能正常跳转。

## 首页模块

首页相关内容都放在 `config.home` 下。

`quote` 控制首页引语：

```toml
[config.home.quote]
text = ["Navigate your world,", "Showcase your story,", "and keep everything in one place."]
image = "/images/logo-with-name.png"
```

`intro` 控制首页主介绍文案：

```toml
[config.home.intro]
title = "here is navfolio"
name = "navfolio"
body = [
  "The name combines \"Navigation\" and \"Portfolio\".",
  "Navfolio focuses on lightweight organization, smooth reading experience, and developer-friendly aesthetics.",
]
image = "/images/logo-cat.png"
```

`navigation` 是首页身份入口卡片：

```toml
[[config.home.navigation]]
icon = "github"
title = "Open Source"
subtitle = "Code, experiments, and tools"
href = "https://github.com/navfolio"
```

`connect` 是联系方式和常用入口：

```toml
[[config.home.connect]]
label = "Email"
href = "mailto:hello@navfolio.site"
icon = "mail"
```

`doing` 是最近关注事项：

```toml
[[config.home.doing]]
text = "Improving static-site publishing workflow"
mark = "03"
```

## 图标名称

`icon` 字段会传给 `src/components/Icon.astro`。可用名称由组件里的 `icons` 映射决定，例如：

- `compass`
- `pen`
- `briefcase`
- `github`
- `book`
- `repo`
- `mail`

如果你需要新的图标，先在 `Icon.astro` 中从 `lucide-astro` 引入并加入映射，再在 TOML 中使用对应名称。

## Schema 校验

`src/content.config.ts` 中的 `siteConfig` 集合会校验 TOML 结构。比如：

- `site.repository` 必须是 URL。
- `profile.email` 必须是 email。
- `home.layout` 目前只允许 `grid`。
- `home.navigation` 必须包含 `icon`、`title`、`subtitle`、`href`。
- `home.doing` 必须包含 `text` 和 `mark`。

如果字段缺失或类型错误，`bun run build` 会在构建阶段报错。这样配置问题会更早暴露，也更容易定位。

## 在组件中使用

Astro 组件支持顶层 `await`，所以可以直接读取配置：

```astro
---
import { getSiteConfig } from '../data/site';

const { site, profile, home, topNav } = await getSiteConfig();
---
```

普通页面、布局、RSS endpoint 也使用同一个 helper。这样站点标题、RSS 描述、首页数据、作者卡片和顶部导航都来自同一份 TOML。

## 修改建议

编辑 TOML 时，优先保持现有分组：

- 站点级元信息放在 `[config.site]`。
- 作者和身份信息放在 `[config.profile]`。
- 顶部导航放在 `[[config.topNav.links]]`。
- 首页展示数据放在 `[config.home]` 及其子表。

新增模块时，先想清楚它是站点级配置、作者资料，还是首页展示数据。结构稳定后，再在 `src/content.config.ts` 补上 schema，并让组件通过 `getSiteConfig()` 消费它。
