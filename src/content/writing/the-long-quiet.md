---
kind: book
book: the-long-quiet
title: The Long Quiet
description: A sample novella with chapter navigation, included to demonstrate how serialised writing is structured — one file per chapter.
form: novella
published: 2026-10-12
demo: true
tags: ['fiction', 'sample']
---

**Demonstration content.** *The Long Quiet* is a placeholder novella shipped with the template so
you can see how a multi-chapter work is built, navigated and read. The prose is intentionally
short. Delete this folder and add your own book instead.

## About this sample

A book in this template is not one enormous file. It is a folder:

```text
src/content/writing/the-long-quiet/
├── _book.md      ← this overview (kind: book)
├── 01-the-ferry.md
└── 02-the-house.md
```

Every chapter file sets `book: the-long-quiet` and a `chapter` number. The site collects them,
sorts them by that number, and generates a reading page for each one with previous/next links,
plus this overview page with its own contents list.

## Why split the files

Because a novel is not a blog post. Chapters get edited independently, previewed independently,
and a chapter is a natural unit of a draft. Splitting also keeps any single file small enough to
read in a text editor, which matters more than it sounds when a manuscript reaches eighty chapters.

Set `draft: true` on a chapter you are not ready to publish. The chapter page, the contents list
and the "next chapter" chain all skip it automatically.
