---
title: Hello from a static site
description: A first post, and a short note on why this site is built out of plain files rather than a database.
published: 2026-11-01
tags: ['meta', 'writing']
demo: true
---

**Demonstration content.** A sample first post — the kind of thing that ends up at the bottom of
an archive two years later.

This site is a folder of Markdown files and a build command. There is no database, no login, no
dashboard. Publishing means writing a file, committing it, and pushing.

## Why bother

The short answer: because I want to still understand this site in five years. A file system is a
very boring, very durable interface. If I forget how the content collections work, I can open
`src/content.config.ts` and read it in a minute — the schema *is* the documentation.

The longer answer is that the interesting part of a portfolio is not the software it runs on.
It is the work the software describes. Every hour spent maintaining an admin interface is an hour
not spent building the thing the interface was going to display.

## What you can expect here

Notes on things I build, decisions I had to make and why, and the occasional post-mortem of
something that did not work. Writing to think is underrated; writing to publish is a good forcing
function for the former.
