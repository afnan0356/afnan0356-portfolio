---
title: The quiet cost of a framework
description: A short, unsentimental look at what a JavaScript framework really costs a portfolio site, and when plain HTML is the better trade.
published: 2026-09-14
tags: ['performance', 'astro']
demo: true
---

**Demonstration content.** Replace with your own article.

A personal site is one of the few web projects where the audience is genuinely small, the content
is genuinely static, and the only thing at stake is whether someone can read it on a phone with
one bar of signal. That makes it a good place to be ruthless about dependencies.

## Three costs worth counting

**Bytes.** Every framework ships a runtime before it ships your words. On a mid-range Android
device over a slow connection, a few hundred extra kilobytes is not an abstraction — it is enough
time to put the phone down.

**Attention.** A dependency is a thing to update, a thing that can break, and a thing a future
reader has to understand before they can change a heading. This site has a handful of packages,
and I can name what each one does.

**Complexity that hides.** Client-side rendering hides content from crawlers unless you are
careful, hides errors behind a blank screen, and hides the cost of an image behind a network tab
most people never open.

## What I kept

Static generation, typed frontmatter, and a content collection. No client-side router, no
component library, no CSS framework. What remains is a build step that turns Markdown into HTML
and about two kilobytes of script for the theme toggle and the mobile menu.

That is not a moral position — plenty of projects genuinely need a framework. It is just a
decision that matches the work: mostly text, read once, on a device that deserves better.
