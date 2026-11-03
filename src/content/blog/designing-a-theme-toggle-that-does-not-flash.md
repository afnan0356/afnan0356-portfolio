---
title: A theme toggle that does not flash
description: How this site switches between dark and light without the white flash, and why the flash happens in the first place.
published: 2026-10-28
tags: ['css', 'accessibility', 'astro']
featured: true
demo: true
---

**Demonstration content.** This article is a sample shipped with the template so you can see how
the blog layout, metadata and typography behave with real prose. Replace it with your own writing.

The most common theme-switching bug on the web is not a broken toggle. It is a *flash*: the page
paints in the default palette, then the stored preference is read from JavaScript a moment later
and the whole page flips. On a slow phone that flip is visible for several hundred milliseconds.

## Why it happens

Styles are parsed before scripts run, and a script placed at the end of the document runs long
after the first paint. If the saved theme lives in `localStorage`, it is only readable from
JavaScript — so any design that waits for a script will flash.

## The fix: paint the theme in the head

The only reliable fix is to set the theme *before* the browser paints the page. A blocking script
in `<head>` runs before the body is rendered:

```js
const root = document.documentElement;
const saved = localStorage.getItem('theme');
root.dataset.theme = saved === 'light' ? 'light' : 'dark';
```

Three details make it robust:

1. **Read defensively.** In private browsing, `localStorage` can throw. Wrap it in `try`/`catch`.
2. **Fall back to the system.** If nothing is stored, use `prefers-color-scheme` rather than
   assuming dark.
3. **Keep the two in sync.** Listen for changes to `prefers-color-scheme`, but only apply them
   while the visitor has not chosen explicitly.

## Making the switch feel intentional

Once the flash is gone, the remaining work is choreography. This site uses a circular reveal
through the View Transitions API:

```js
document.startViewTransition(() => applyTheme(next));
```

…then animates `clip-path` from a zero-radius circle at the button to a circle large enough to
cover the viewport. Because the API is a progressive enhancement, the code checks for it first
and falls back to an instant switch. It also checks `prefers-reduced-motion` and skips the
animation entirely when the visitor has asked for less movement.

> A transition is a courtesy, not a requirement. If a browser cannot do it, the theme should still
> change immediately and correctly.

## What to measure

If you want to verify a fix like this, do not trust screenshots. Record a screen capture on a
throttled connection, or log `performance.now()` at first paint and at theme application. The
number that matters is the gap between them — it should be zero.
