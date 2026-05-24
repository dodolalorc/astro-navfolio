---
title: '少年的故事，你的免费域名'
description: '一个十五岁少年因朋友的一句"能不能借我用用"，意外开启了一段改变四十万人上网体验的旅程。这篇文章讲述 DigitalPlat FreeDomain 的诞生故事，以及如何用它免费注册属于自己的域名。描述在DigitalPlat申请免费域名的方法和步骤。'
date: '2026-05-24T21:37:00+08:00'
draft: false
heroImage: '/src/assets/figure/a-young-man-s-story-your-free-domain.png'
showHeroImage: true
tags:
  - 免费域名
  - 域名
  - 免费
  - DigitalPlat
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---
## 一个少年，一个域名
三年前，一个名叫 [Edward](https://github.com/EdwardLab "EdwardLab | Edward Hsing") 的少年，十五岁，用零花钱买下了一个域名。

不是为了创业，不是为了赚钱，甚至没有一个说得清楚的理由。只是某天脑子里冒出一个念头：我想看看自己能做出什么。少年的冲动，往往就是这么简单，也正因为简单，才格外纯粹。

那时候，Edward 注意到一件让他觉得别扭的事：在互联网上拥有一个属于自己的域名，怎么这么难？要花钱，要配置，要跨过一道又一道的门槛——对很多人来说，这件事不是难，而是根本遥不可及。他想不通，这有什么道理？

但彼时的他还没想那么远。他只是拿着刚买来的域名，开始漫无目的地折腾——搭一个页面，试一个功能，改了删，删了再来。像一个人独自在空旷的院子里踢球，没有观众，没有规则，只有一颗停不下来的脑袋，和用不完的好奇心。

## 朋友的一句话，改变了一切
直到有一天，朋友找上门来。“Edward，你的域名能不能借我用用？我想在下面建一个子域名。” 他答应了。没过多久，又来了一个朋友，提出了同样的请求。接着，是第三个。

就在那个瞬间，Edward 忽然明白了一件事：这个域名，已经不再只属于他一个人了。

他没有感到被打扰，反而感到某种召唤——世界上有那么多人，想在互联网上占有一席之地，想拥有一个属于自己的名字，却因为价格、门槛、繁琐的流程而望而却步。这件事本不该如此困难，而他或许可以改变。

Edward埋下头，开始动手。在一台小小的 VPS 上部署了 BIND9 DNS 服务器，用 Python 和 Flask 一行一行写出自己的后端，再将所有的模块拼接起来，直接接入 DNS 底层。没有现成的轮子可用，没有参考的先例可循，一个可以让所有人自由注册和管理域名的平台，就在他的指尖缓缓成形。

平台上线之后，Edward 很快发现，真正的挑战不是把系统跑起来，而是让它在混乱中活下去。免费的东西，总会招来滥用：垃圾邮件、钓鱼网站、恶意注册……他没有选择回避，而是为此专门构建了一整套防御体系——自动化审核流水线、行为模式评分、基于 GitHub 身份的实名核验、结构化的举报与响应机制。他知道，无法消灭所有的恶意，但至少要让其他人仍然可以安心使用这个系统。

这个平台，后来有了一个名字 —— [DigitalPlat FreeDomain](https://dash.domain.digitalplat.org/signup?ref=qcgHhAxQvr, "DigitalPlat Domain Registry")。

## 没有发布会的逆袭

DigitalPlat FreeDomain用 Python 和 Flask 搭建，谈不上精雕细琢，也没有华丽的界面设计，但它能跑，能用，能承载一个又一个陌生人的小小需求。用户一批一批地涌进来——没有发布会，没有广告投放，没有任何融资背书，全凭开发者圈子里那种古老而朴素的方式：口口相传，互相分享，把链接悄悄发给觉得会用得上的朋友。

从数百人，到数千人，再到数万人——

最终，这个少年在十五岁时不经意间埋下的种子，长成了一棵参天大树：服务全球超过四十万注册用户，并在 [GitHub](https://github.com/DigitalPlatDev/FreeDomain, "Welcome to DigitalPlat Domain") 上收获了高达 16 万 Star 的项目。

## 选哪个后缀？先看这里
目前，[DigitalPlat FreeDomain](https://dash.domain.digitalplat.org/signup?ref=qcgHhAxQvr, "DigitalPlat Domain Registry") 提供五种二级域名后缀：dpdns.org、qzz.io、qd.je、us.kg、xx.kg。其中前三种完全免费，后两种象征性地收取少量费用。

这里有一个值得留意的小细节：注册域名之后，大多数用户会选择交由 CloudFlare 托管。但 CloudFlare 会将 qzz.io 和 qd.je 识别为子域名，导致无法正常接入。因此，推荐优先注册 dpdns.org 后缀的域名，兼容性最佳，省去不少麻烦。


## 五步注册，轻松上手
注册步骤十分简单：

1. 点击 [DigitalPlat FreeDomain](https://dash.domain.digitalplat.org/signup?ref=qcgHhAxQvr, "DigitalPlat Domain Registry") 进入平台，使用 GitHub 或 Google 账号登录；
1. 在左侧菜单找到 "Register / 注册"，点击进入；
1. 选择后缀 dpdns.org，输入你心仪的前缀；
1. 勾选"同意服务条款"，点击 "检查可用性"；
1. 若该前缀尚未被人抢占，按提示一步步走下去，属于你的域名，就这样到手了。

## 结语
有时候，改变世界的东西，起点只是一句"你能不能借我用用"。