---
title: '配置 Navfolio 的主题色盘'
description: '了解 navfolio 如何通过 src/config/site.toml 选择内置色彩预设，并在保留明暗模式的同时切换整站视觉氛围。'
date: '2026-05-20T16:07:19.299Z'
draft: false
heroImage: '/src/assets/figure/theme-hero.png'
showHeroImage: false
tags:
  - Astro
  - Theme
  - Configuration
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---

Navfolio 的视觉系统现在拆成了两个互不干扰的维度：

- `data-theme`：控制明暗模式，也就是页面亮度、背景深浅、文字对比度和基础表面层次。
- `data-palette`：控制色彩家族，也就是链接、强调色、淡色背景、装饰纹理和细线氛围。

这样做的好处是，站点仍然保留原来的 light / dark 切换逻辑，同时可以通过配置选择不同的色彩气质。你不需要在页面上增加运行时调色器，也不需要让访问者手动挑颜色；主题色盘是站点维护者在构建前决定的。

## 配置位置

主题色盘配置位于：

```bash
src/config/site.toml
```

在 `site.toml` 中找到或新增这一段：

```toml
[config.theme]
palette = "green-soft"
```

`palette` 的值会在开发和构建时读取，并渲染到根元素上：

```html
<html data-theme="light" data-palette="green-soft"></html>
```

如果用户切换到暗色模式，`data-theme` 会继续由现有的主题切换脚本更新：

```html
<html data-theme="dark" data-palette="green-soft"></html>
```

也就是说，`palette` 负责“是什么颜色”，`theme` 负责“亮还是暗”。它们不会合并成 `green-light`、`green-dark` 这种组合值，因此后续维护会更清晰。

## 可用色盘

当前内置 8 个色盘：

| 名称          | 气质                                           |
| ------------- | ---------------------------------------------- |
| `green-soft`  | 默认色盘，延续原本低饱和绿色与纸感背景         |
| `green-vivid` | 更清晰一点的绿色，适合希望强调链接和按钮的站点 |
| `rose-soft`   | 低饱和玫瑰色，温和但不接近警告红               |
| `pink-soft`   | 柔和粉色，适合轻盈、私人化的写作空间           |
| `purple-soft` | 安静的紫色，偏知识库和个人笔记氛围             |
| `blue-soft`   | 干净的蓝色，偏开发者友好和技术文档感           |
| `orange-soft` | 温暖橙色，适合更有生活感的个人站点             |
| `brown-soft`  | 纸张、笔记本、咖啡色调，和当前纸感视觉很搭     |

## 色盘预览

下面的截图分别展示同一色盘在首页和博客列表页中的效果。首页更容易观察整体背景、卡片和导航氛围，博客页更容易观察文字、图片边界、列表分隔和强调色是否舒适。

### green-soft

![green-soft 首页预览](../../assets/figure/theme-preview/green-soft-home.png)

![green-soft 博客页预览](../../assets/figure/theme-preview/green-soft-blog.png)

### green-vivid

![green-vivid 首页预览](../../assets/figure/theme-preview/green-vivid-home.png)

![green-vivid 博客页预览](../../assets/figure/theme-preview/green-vivid-blog.png)

### rose-soft

![rose-soft 首页预览](../../assets/figure/theme-preview/rose-soft-home.png)

![rose-soft 博客页预览](../../assets/figure/theme-preview/rose-soft-blog.png)

### pink-soft

![pink-soft 首页预览](../../assets/figure/theme-preview/pink-soft-home.png)

![pink-soft 博客页预览](../../assets/figure/theme-preview/pink-soft-blog.png)

### purple-soft

![purple-soft 首页预览](../../assets/figure/theme-preview/purple-soft-home.png)

![purple-soft 博客页预览](../../assets/figure/theme-preview/purple-soft-blog.png)

### blue-soft

![blue-soft 首页预览](../../assets/figure/theme-preview/blue-soft-home.png)

![blue-soft 博客页预览](../../assets/figure/theme-preview/blue-soft-blog.png)

### orange-soft

![orange-soft 首页预览](../../assets/figure/theme-preview/orange-soft-home.png)

![orange-soft 博客页预览](../../assets/figure/theme-preview/orange-soft-blog.png)

### brown-soft

![brown-soft 首页预览](../../assets/figure/theme-preview/brown-soft-home.png)

![brown-soft 博客页预览](../../assets/figure/theme-preview/brown-soft-blog.png)

默认值是：

```toml
[config.theme]
palette = "green-soft"
```

如果你删除整个 `[config.theme]` 配置块，或者只保留 `[config.theme]` 但不写 `palette`，构建时也会回退到 `green-soft`。

## 切换色盘

例如你想让站点变成更安静的紫色，只需要改成：

```toml
[config.theme]
palette = "purple-soft"
```

然后启动开发服务器：

```bash
bun run dev
```

或者构建静态站点：

```bash
bun run build
```

构建出的 HTML 会直接包含当前配置：

```html
<html data-palette="purple-soft"></html>
```

这个值来自服务端渲染，不依赖浏览器端 JavaScript。访问者进入页面时不需要等待脚本执行，页面就已经带着正确的色盘。

## 和明暗模式的关系

Navfolio 原有的明暗模式切换仍然有效。顶部导航中的主题按钮只会改变 `data-theme`，不会改动 `data-palette`。

举例来说，如果你在配置中选择：

```toml
[config.theme]
palette = "blue-soft"
```

那么浅色模式会使用蓝色系的强调色和淡背景，暗色模式会使用同一蓝色家族的暗色版本。用户切换明暗模式时，页面会在同一色盘家族中切换亮度层次，而不是切到另一套完全不同的视觉风格。

这种结构让色彩系统保持克制：

- 站点维护者负责选择整体色彩气质。
- 访问者只负责选择明暗阅读偏好。
- CSS 不需要为每个“色盘 + 明暗”组合复制完整主题变量。

## 校验规则

`palette` 会经过 `src/content.config.ts` 中的 schema 校验。只有内置枚举值能通过构建。

合法示例：

```toml
[config.theme]
palette = "brown-soft"
```

非法示例：

```toml
[config.theme]
palette = "neon-cyber-red"
```

如果写了不存在的色盘，`bun run build` 会在内容同步阶段报错，提示 `theme.palette` 不是允许的枚举值。这样可以避免拼写错误悄悄进入部署产物。

## 色盘样式在哪里

色盘变量集中放在：

```bash
src/styles/palettes.css
```

全局样式入口仍然是：

```bash
src/styles/global.css
```

`global.css` 负责布局、字体、明暗模式、文字颜色、基础表面和阴影等不随色盘大幅变化的内容；`palettes.css` 只负责色彩家族相关变量，例如：

```css
--accent
--accent-dark
--paper-accent
--paper-accent-soft
--paper-fog
--paper-dust
--paper-rule
--paper-texture-ink
```

如果你只想换站点氛围，优先改 `site.toml`。如果你要新增一套内置色盘，再去改 `palettes.css` 和 schema。

## 新增自定义预设

如果你想把色盘扩展成自己的固定预设，可以按这个顺序做：

1. 在 `src/styles/palettes.css` 中新增一组选择器，例如 `:root[data-palette='cyan-soft']`。
2. 为这组色盘补充暗色模式覆盖，例如 `:root[data-theme='dark'][data-palette='cyan-soft']`。
3. 在 `src/content.config.ts` 的 `paletteSchema` 中加入 `'cyan-soft'`。
4. 在 `src/config/site.toml` 中把 `palette` 改为新名称。
5. 运行 `bun run build` 确认 schema 和页面构建都通过。

新增色盘时建议保持低饱和、低对比的大面积背景，只让链接、按钮、细线和轻量装饰承担色彩变化。Navfolio 的主题目标不是变成强烈的品牌皮肤，而是在同一套安静阅读系统里换一盏不同色温的小灯。

## 推荐检查

切换色盘后，至少检查这些页面：

```bash
/
/blog
/projects
/vibe
任意一篇文章详情页
```

重点看：

- 正文和元信息是否仍然清晰。
- 顶部导航、链接和按钮是否还像可交互元素。
- 卡片边界是否保持轻盈。
- 文章页目录和引用块是否没有变得刺眼。
- 暗色模式下背景纹理和细线是否不过重。

最后运行：

```bash
bun run format:check
bun run build
```

如果两个命令都通过，基本就可以认为这次色盘配置调整是安全的。
