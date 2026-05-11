# navfolio

navfolio is an Astro starter for building a personal navigation portfolio. It combines a profile card, quick links, GitHub stat cards, a blog, a clock, a calendar, and a short activity list in one responsive dashboard.

![Homepage preview](./homepage.png)

## Features

- Astro static site with Markdown and MDX blog support.
- Responsive dashboard layout for desktop and mobile.
- Centralized profile, navigation, social, GitHub, and activity data in `src/data/profile.ts`.
- Configurable GitHub Stats image cards.
- Shared icon adapter built on `lucide-astro`.
- RSS and sitemap support.
- GitHub Pages workflow included.

## Stack

- Astro 6
- Bun
- Tailwind CSS 4
- lucide-astro
- @astrojs/mdx
- @astrojs/rss
- @astrojs/sitemap

## Project Structure

```text
public/
  images/                 Static homepage images
src/
  components/
    cards/                Dashboard cards
    layout/               Dashboard grid layout
    widgets/              Clock, calendar, and activity widgets
    Icon.astro            Shared icon adapter
  content/blog/           Markdown and MDX blog posts
  data/profile.ts         Main profile and homepage configuration
  layouts/                Base and blog layouts
  pages/                  Astro routes
  styles/global.css       Global styles
astro.config.mjs          Astro configuration
package.json              Scripts and dependencies
homepage.png              Homepage screenshot
```

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

## Customize Content

Most homepage content lives in `src/data/profile.ts`:

- `profile`: name, handle, role, avatar, GitHub URL, email, website, and location.
- `navigationLinks`: primary navigation cards.
- `quote`: quote card text and image.
- `intro`: introduction card content.
- `githubStats`: GitHub Stats image configuration and query parameters.
- `connectLinks`: social and contact links.
- `doingItems`: recent work or focus items.

The site title and meta description live in `src/consts.ts`.

## GitHub Stats

The GitHub Stats image URL is generated from `githubStats.baseUrl`. To use the public service:

```ts
baseUrl: 'https://github-readme-stats.vercel.app';
```

For private repository stats or lower rate-limit risk, deploy your own `github-readme-stats` instance and set `githubStats.baseUrl` to that deployment.

## Blog Content

Blog posts live in `src/content/blog/` and support `.md` and `.mdx` files.

Relevant pages:

- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`

## Deployment

This is a static Astro project and can be deployed to any platform that supports Node or Bun builds.

### GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`.

The workflow:

- Deploys on pushes to `main` or `master`.
- Supports manual runs through `workflow_dispatch`.
- Computes the correct GitHub Pages `site` and `base` paths for project pages and user pages.

Recommended build command:

```sh
bun run build
```

Output directory:

```text
dist
```
