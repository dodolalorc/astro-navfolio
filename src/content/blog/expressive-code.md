---
title: '使用 Expressive Code 展示代码块'
description: ''
date: '2026-05-24T16:21:33.842Z'
draft: false
showHeroImage: false
tags: []
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---

我们采用表达力更强，更美观的 [Expressive Code](https://expressive-code.com/) 来展示代码块，更多的语法上的用法可以关注官方的文档。

# 配置

我们在 `config/site.toml` 中可以对代码块使用的主题以及一些插件进行配置：

```toml
[config.code]
lightTheme = "catppuccin-latte"
darkTheme = "catppuccin-macchiato"
lineNumbers = true
wrap = true
preserveIndent = true
collapseStyle = "collapsible-auto"
```

我们的主题默认启用以下功能：

1. 显示行号
2. 自动折行
3. 折叠长代码

# 主题

我们可以在 [主题](https://expressive-code.com/guides/themes/) 页面来找到支持的主题，自行填写中意的代码主题即可

但是注意，如果只想要单一主题的话（例如都是暗色主题），那么需要填写为：

```toml {2}
[config.code]
lightTheme = "catppuccin-macchiato"
darkTheme = "catppuccin-macchiato"
```

# 显示行号与标题

我们可以通过 `showLineNumbers` 这个选项来知道显式的决定是否显示行号（默认为显示），例如：

````md "showLineNumbers=false"
```js showLineNumbers=false
const foo = 'bar';
```
````

其显示为：

```js showLineNumbers=false
const foo = 'bar';
```

如果想要显示标题，我们可以考虑：

````md
```js title="这是标题"
const foo = 'bar';
```
````

显示为：

```js title="这是标题"
const foo = 'bar';
```

# 高亮行与文字

高亮行支持以下三种格式：

1. github 的插入格式，写法为 `ins={"desc": lineno-lineno}`
2. github 的删除格式，写法为 `del={"desc": lineno-lineno}`
3. 普通高亮模式，写法为 `{"desc": lineno-lineno}`

注意，`"desc"` 也会占用一行，如果要添加这样的描述，需要注意自己的行数没有数错。

例如：

````md
```js ins={1-3} del={5} {"desc": 6-7}
const line1 = 'insert';
const line2 = 'ii';
const line3 = 'nn';

const line5 = 'del';

const line7 = 'mark';
```
````

显示为：

```js ins={1-3} del={5} {"desc": 6-7}
const line1 = 'insert';
const line2 = 'ii';
const line3 = 'nn';

const line5 = 'del';

const line7 = 'mark';
```

而高亮文字，可以写为：

````md
```js "foo"
const foo = 'foo' + 'bar';
```
````

显示为：

```js "foo"
const foo = 'foo' + 'bar';
```

# 长代码折叠

````md "collapse={1-5, 12-14, 21-24}"
```js collapse={1-5, 12-14, 21-24}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate';
import { evenMoreBoilerplate } from '@example/even-more-boilerplate';

const engine = someBoilerplateEngine(evenMoreBoilerplate());

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn);

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1;
  const b = 2;
  const c = a + b;

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`);
  return c;
}

// All this code until the end of the block will be collapsed again
engine.closeConnection();
engine.freeMemory();
engine.shutdown({ reason: 'End of example boilerplate code' });
```
````

我们默认的格式为 `github` 折叠格式，显示为：

```js collapse={1-5, 12-14, 21-24}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate';
import { evenMoreBoilerplate } from '@example/even-more-boilerplate';

const engine = someBoilerplateEngine(evenMoreBoilerplate());

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn);

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1;
  const b = 2;
  const c = a + b;

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`);
  return c;
}

// All this code until the end of the block will be collapsed again
engine.closeConnection();
engine.freeMemory();
engine.shutdown({ reason: 'End of example boilerplate code' });
```
