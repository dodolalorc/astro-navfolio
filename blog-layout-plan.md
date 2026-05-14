# Blog Detail Page Layout Plan

## Goal

Create a blog article detail page that continues the visual language of the navfolio homepage.

The page should feel like a clean, soft, floating personal knowledge space, but the layout must be easy to implement and stable in code.

Avoid overly tilted or irregular article content. The central reading area must remain straight, readable, and grid-aligned.

---

## Visual Keywords

- Soft dashboard
- Floating cards
- Pastel mint green
- Clean personal blog
- Airy layout
- Light neumorphism
- Rounded corners
- Low contrast
- Calm tech aesthetic
- Personal knowledge space

---

## Page Structure

Use a stable three-column layout:

```txt
┌──────────────────────────────────────────────┐
│                  Top Nav                     │
├──────────────┬────────────────┬──────────────┤
│ Left Sidebar │ Article Content │ Right Sidebar│
│              │                │              │
└──────────────┴────────────────┴──────────────┘
````

Recommended desktop layout:

```css
.blog-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 680px) 260px;
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 96px 32px 48px;
}
```

---

## Background

The page background should not be pure white.

Use a soft gradient background:

```css
background:
  radial-gradient(circle at 15% 10%, rgba(183, 240, 226, 0.45), transparent 30%),
  radial-gradient(circle at 85% 20%, rgba(240, 245, 225, 0.55), transparent 35%),
  linear-gradient(135deg, #f5fbfa 0%, #eef8f5 50%, #fbfaf4 100%);
```

Optional decorative elements:

* Very subtle orbit lines
* Small floating green spheres
* Soft blurred circles

These should be absolute positioned and non-interactive.

---

## Top Navigation

Top nav should be simple and fixed-width.

Content:

* Logo: `navfolio`
* Navigation links:

  * Home
  * Blog
  * Projects
  * About
* Right actions:

  * Theme toggle
  * Search icon

Current page `Blog` should have a small green active dot below it.

Keep the top nav straight and minimal.

---

## Left Sidebar

The left sidebar contains personal and article-related info.

Cards:

### 1. Author Card

Content:

* Avatar
* Site name: `navfolio`
* Handle: `@navfolio`
* Small badge: `A Cat Developer`
* Social icons

Style:

* White / translucent card
* Large rounded corners
* Soft shadow
* Center aligned

### 2. On This Page Card

A compact table of contents.

This can duplicate the right sidebar TOC or be hidden if redundant.

Recommended sections:

* Why a Second Brain?
* The Modern Stack
* Capture Everything
* Connect Ideas with AI
* Create and Share
* Final Thoughts

### 3. Article Info Card

Content:

* Reading time
* Published date
* Updated date
* Tags

Tags should use pill-style chips.

### 4. Quote Card

A small decorative quote card.

Example:

> Writing is thinking.
> To write well is to think clearly.

---

## Main Article Content

The central article area is the most important part.

It must be straight, not rotated.

Use one large article card:

```css
.article-card {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 32px;
  box-shadow: 0 24px 80px rgba(50, 80, 70, 0.12);
  padding: 56px;
  backdrop-filter: blur(16px);
}
```

### Article Header

Content:

* Category line:
  `DESIGN / THINKING / AI`
* Title:
  `Building a Second Brain with AI in 2026`
* Subtitle:
  `A practical guide to creating your digital knowledge system that actually works.`
* Meta row:

  * Date
  * Reading time
  * Updated date

Title should be large, bold, and readable.

Use green highlight for important words or year.

---

## Article Body Style

The article body should feel spacious.

Recommended styles:

```css
.article-content {
  font-size: 16px;
  line-height: 1.85;
  color: #1f2a3d;
}

.article-content h2 {
  margin-top: 56px;
  margin-bottom: 20px;
  font-size: 26px;
}

.article-content p {
  margin-bottom: 20px;
}
```

Use generous spacing between sections.

---

## Special Content Blocks

### Highlight Callout

Use soft green callout blocks:

```txt
💡 The goal is not to remember more,
but to think more clearly.
```

Style:

* Light mint background
* Rounded corners
* Small icon
* Padding
* No heavy border

### Code Block

Code blocks should be light, not dark.

```css
.code-block {
  background: #f8fbfa;
  border: 1px solid rgba(120, 160, 145, 0.18);
  border-radius: 18px;
  padding: 20px;
}
```

### Images

Images should be:

* Full width inside article card
* Rounded corners
* Soft shadow
* No rotation

---

## Right Sidebar

The right sidebar contains secondary reading tools.

Cards:

### 1. Table of Contents Card

This is the main TOC.

Use a vertical timeline style:

```txt
● 1. Why a Second Brain?
│
○ 2. The Modern Stack
│
○ 3. Capture Everything
│
○ 4. Connect Ideas with AI
```

Active section:

* Green dot
* Green text
* Slightly highlighted background
* Rounded floating pill

The TOC should be sticky on desktop:

```css
.right-sidebar {
  position: sticky;
  top: 96px;
}
```

### 2. More From navfolio

Small related article list.

Each item:

* Thumbnail
* Title
* Date

### 3. Subscribe Card

Content:

* Small illustration/icon
* Title: `Like this article?`
* Description
* Email input
* Subscribe button

---

## Bottom Floating Bar

At the bottom of the main article area, add a soft floating action bar.

Content:

* Was this helpful?
* Like button
* Dislike button
* Share article
* Copy link

Style:

```css
.bottom-action-bar {
  position: sticky;
  bottom: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 48px rgba(50, 80, 70, 0.12);
  backdrop-filter: blur(16px);
}
```

---

## Responsive Layout

### Tablet

Use two columns:

```txt
Article Content | Right TOC
```

Hide or collapse the left sidebar.

### Mobile

Use single column:

```txt
Top Nav
Article Header
Article Content
Related Articles
Subscribe
```

Mobile rules:

* Hide left sidebar
* Hide right sidebar
* Replace TOC with a collapsible “On this page” button
* Reduce article padding
* Keep article card full width
* Avoid horizontal overflow

Example:

```css
@media (max-width: 768px) {
  .blog-layout {
    display: block;
    padding: 80px 16px 32px;
  }

  .left-sidebar,
  .right-sidebar {
    display: none;
  }

  .article-card {
    padding: 28px 22px;
    border-radius: 24px;
  }
}
```

---

## Implementation Notes

Use CSS Grid for the main layout.

Avoid absolute positioning for major content areas.

Allowed absolute positioning:

* Background decorations
* Floating spheres
* Orbit lines

Do not rotate the main article card.

Small decorative cards may have very subtle rotation, but article readability comes first.

Recommended component structure:

```txt
src/pages/blog/[slug].astro
src/components/blog/BlogLayout.astro
src/components/blog/ArticleCard.astro
src/components/blog/AuthorCard.astro
src/components/blog/TableOfContents.astro
src/components/blog/ArticleInfoCard.astro
src/components/blog/RelatedPosts.astro
src/components/blog/SubscribeCard.astro
src/components/blog/BottomActionBar.astro
```

---

## Design Priority

The final page should feel:

* more structured than the homepage
* still soft and floating
* readable for long-form articles
* easy to maintain
* stable across screen sizes

The main rule:

> Keep the article content clean and straight.
> Let the side cards and background carry the playful floating feeling.

```
