<p align="center">
  <img src="./public/images/logo-with-name.png" alt="Navfolio logo with name" width="360" />
</p>

<p align="center">
  An Astro starter for building a personal navigation portfolio. It brings your profile, quick links, GitHub stats, blog, calendar, clock, and recent activity into one lightweight responsive homepage.
  <br />
  <sub>Currently under active development. Features and visual details may continue to change.</sub>
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

## Preview

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

## About

Navfolio combines Navigation and Portfolio. It is not a traditional one-page resume. It is a configurable personal entry point where you can collect your portfolio, blog, resume, open-source work, contact links, status cards, and recent activity in a single homepage.

It works well as:

- A personal homepage and navigation page
- A public entry point for open-source maintainers
- A hub for portfolio, blog, and resume links
- An Astro static-site starter

## Features

- Astro static site with Markdown and MDX blog support.
- Responsive dashboard layout for desktop and mobile.
- Centralized homepage content in `src/data/profile.ts`.
- Built-in profile, navigation cards, intro card, GitHub Stats, social links, clock, calendar, and recent activity.
- Shared icon adapter powered by `lucide-astro`.
- RSS, Sitemap, and GitHub Pages deployment workflow support.

## Stack

- Astro 6
- Bun
- Tailwind CSS 4
- lucide-astro
- @astrojs/mdx
- @astrojs/rss
- @astrojs/sitemap

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

## Customization

Most homepage content lives in `src/data/profile.ts`:

- `profile`: name, role, avatar, GitHub, email, website, and location.
- `navigationLinks`: homepage navigation cards.
- `quote`: top quote and display image.
- `intro`: project or personal introduction card.
- `githubStats`: GitHub stats card configuration.
- `connectLinks`: social and contact links.
- `doingItems`: recent activity or current focus.

The site title and meta description live in `src/consts.ts`.

## Project Structure

```text
public/
  images/                 Brand, cover, and homepage presentation images
src/
  components/
    cards/                Homepage card components
    layout/               Dashboard layout
    widgets/              Clock, calendar, and activity widgets
    Icon.astro            Shared icon adapter
  content/blog/           Markdown / MDX blog posts
  data/profile.ts         Main homepage configuration
  layouts/                Base and blog layouts
  pages/                  Astro routes
  styles/global.css       Global styles
astro.config.mjs          Astro configuration
```

## Deployment

This is a static Astro project and can be deployed to any platform that supports Node or Bun builds.

The repository includes `.github/workflows/deploy-pages.yml` for GitHub Pages deployment. Recommended build command:

```sh
bun run build
```

Output directory:

```text
dist
```
