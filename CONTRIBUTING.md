# Contributing to Navfolio

Languages: English | [简体中文](#简体中文)

Navfolio is a quiet Astro starter for personal publishing. Contributions should keep the project readable, lightweight, and easy to maintain.

## Discuss First

Open an issue before starting any non-trivial PR. In that issue, please make these points clear:

- which page, component, config field, or content workflow will change;
- what real use case is blocked or improved by the change;
- whether it changes visuals, routes, schemas, dependencies, or existing user config;

Typos, broken links, and small documentation fixes can go straight to a PR.

## PR Rules

- Link the issue unless the PR is a tiny fix.
- Keep the diff focused on one problem.
- Use Bun commands and existing Astro, TypeScript, content collection, and CSS token patterns.
- Do not add dependencies, broad refactors, or visual redesigns without agreement in the issue.
- Include screenshots for UI changes.
- Update docs when behavior or configuration changes.

## Local Checks

```sh
bun install
bun run dev
bun run build
bun run format:check
```

Run `bun install` only when dependencies are missing or changed. For meaningful code, route, schema, or config changes, run `bun run build` before submitting.

## Review

Maintainers review for project fit, scope, build health, reading comfort, mobile behavior, and maintenance cost. A PR may be closed if the idea is useful only for a personal fork or if the implementation expands beyond the issue agreement.

---

<a id="简体中文"></a>

# 参与贡献

Navfolio 是一个安静的 Astro 个人发布空间 starter。贡献应当保持项目可读、轻量、容易维护。

## 先讨论

非微小改动请先开 issue，再开始写 PR。Issue 里请把这些点说清楚：

- 会改哪个页面、组件、配置字段或内容工作流；
- 这个改动解决了哪个真实使用场景；
- 它是否会影响视觉、路由、schema、依赖或已有用户配置；

错别字、失效链接和很小的文档修正可以直接开 PR。

## PR 规则

- 除非是很小的修正，否则 PR 需要链接 issue。
- 一个 PR 只解决一个清晰的问题。
- 使用 Bun，并沿用现有 Astro、TypeScript、内容集合和 CSS token 写法。
- 未在 issue 中确认前，不要新增依赖、大范围重构或视觉改版。
- UI 改动请附截图。
- 行为或配置变化时，请同步更新文档。

## 本地检查

```sh
bun install
bun run dev
bun run build
bun run format:check
```

只有依赖缺失或变化时才运行 `bun install`。涉及代码、路由、schema 或配置的有效改动，提交前请运行 `bun run build`。

## Review

维护者会关注项目契合度、改动范围、构建状态、阅读舒适度、移动端表现和维护成本。如果想法只适合个人 fork，或实现超出 issue 中确认的范围，PR 可能会被关闭。
