<p align="center">
  <img src="./public/images/logo-with-name.png" alt="Navfolio logo with name" width="360" />
</p>

<p align="center">
  A calm Astro starter for a personal publishing space: homepage, blog, project notes, and a small digital-garden structure in one maintainable site.
  <br />
  <sub>Built for writing-first personal websites with quiet visuals, lightweight motion, and content collections.</sub>
</p>

<p align="center">
  <a href="./README.en.md">English</a>
  ·
  <a href="./README.md">简体中文</a>
</p>

<p align="center">
  <img src="./public/images/logo.png" alt="Navfolio logo" width="72" />
  &nbsp;&nbsp;
  <img src="./public/images/logo-cat.png" alt="Navfolio cat logo" width="72" />
  &nbsp;&nbsp;
  <img src="./public/images/logo-in-one.png" alt="Navfolio compact logo" width="72" />
</p>

## Preview

<p align="center">
  <img src="./public/images/homepage-light.png" alt="Navfolio homepage light theme preview" width="49%" />
  <img src="./public/images/homepage-dark.png" alt="Navfolio homepage dark theme preview" width="49%" />
</p>

## What Navfolio Is

Navfolio combines navigation, portfolio, blog, and project documentation into a single Astro site. It is designed for people who want a personal homepage that can also grow into a readable notebook, a writing archive, and a lightweight project shelf.

The current version focuses on:

- a quiet homepage with profile, identity links, intro copy, writing activity, and current focus cards;
- a `/blog` archive with article thumbnails, dates, and tags;
- Markdown / MDX article pages with optional table of contents and related posts;
- a `/projects` shelf powered by content collections;
- project detail pages for repository notes, design records, and implementation documents;
- an `/about` page rendered with the same calm article layout;
- GitHub Pages friendly base-path handling.

The visual direction is intentionally restrained: soft structure, minimal shadows, notebook-like typography, subtle active states, and images that stay readable in both light and dark themes.

## Routes

```text
/                 Personal dashboard homepage
/blog             Writing archive
/blog/[slug]      Blog article pages
/projects         Project shelf and project index
/projects/[slug]  Project documentation pages
/about            About page
/rss.xml          RSS feed
```

## Content Model

Most content is stored as Markdown or MDX:

```text
src/content/
  about.mdx
  blog/
    first-post.md
    second-post.md
    third-post.md
    ...
  projects/
    index.mdx
    astro-navfolio.mdx
```

Blog posts and project documents share the same article schema:

```yaml
title: 'Article title'
description: 'Short summary for archives and metadata.'
date: '2026-05-18'
draft: false
tags:
  - Astro
sidebar:
  enable: false
  toc: false
  relatedPosts: false
```

`sidebar` is the single source of truth for article utility areas: `enable` toggles the sidebar area, `toc` toggles heading navigation, and `relatedPosts` toggles related-post cards. Blog articles default to showing reading tools when available; `/about` and project pages default to a centered, no-sidebar article layout.

## Homepage Configuration

Homepage and site data lives in `src/config/site.toml`:

- `site`: site title, descriptions, repository URL, and footer note.
- `profile`: name, handle, role, avatar, website, GitHub, email, and metadata.
- `topNav.links`: top navigation links.
- `home.quote` / `home.intro`: homepage motto and main introduction.
- `home.navigation` / `home.connect`: identity links, contact links, and internal entries.
- `home.latest.count`: number of latest posts shown on the homepage, sorted by file modification time.
- `home.doing`: current focus list.

The homepage intentionally stays mostly static and data-driven, so replacing starter content does not require editing component internals.

## Features

- Astro 6 static site architecture.
- Markdown and MDX content collections.
- Article layout with optional TOC, tags, reading time, and related posts.
- Dedicated project shelf and project document routes.
- Calm top navigation with theme toggle and repository link.
- Responsive homepage dashboard.
- RSS and Sitemap support.
- GitHub Pages deployment workflow with project-page base path support.
- Shared icon adapter using `lucide-astro`.
- Local font configuration and global CSS variables.

## Stack

- Astro 6
- Bun
- Tailwind CSS 4 through Vite
- `@astrojs/mdx`
- `@astrojs/rss`
- `@astrojs/sitemap`
- `lucide-astro`
- `sharp`

## Getting Started

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun run dev
```

Build for production:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Project Structure

```text
public/
  images/                 Logos, previews, and homepage images
src/
  assets/                 Blog placeholder images and local fonts
  components/
    article/              Article header components
    blog/                 Blog navigation, TOC, and related posts
    cards/                Homepage cards
    layout/               Dashboard layout
    widgets/              Writing activity and utility widgets
    Icon.astro            Shared icon adapter
  content/
    blog/                 Blog Markdown / MDX
    projects/             Project index and project documents
    about.mdx             About page content
  config/site.toml        Site, profile, navigation, and homepage content configuration
  data/site.ts            TOML config loading helper
  layouts/                Base and article layouts
  pages/                  Astro routes
  styles/global.css       Global theme, typography, and layout variables
astro.config.mjs          Astro, sitemap, MDX, fonts, and base-path config
```

## Deployment

The site builds to static files in `dist`.

For GitHub Pages, the included workflow uses Astro's `site` and `base` configuration. The config automatically supports repository project pages when running in GitHub Actions, and can also be overridden:

```sh
SITE_URL=https://example.com SITE_BASE=/astro-navfolio bun run build
```

## Design Notes

Navfolio is meant to feel like a calm developer notebook:

- content first;
- soft but structured surfaces;
- restrained shadows and borders;
- readable article rhythm;
- subtle motion;
- no heavy marketing layout;
- no visual noise around long-form reading.

The project is also organized for AI-assisted iteration. The `.agents/skills` and `.agents/reviewers` folders describe the local visual language and review standards used while evolving the interface.
