---
title: Example certificate entry
description: A demonstration entry showing how a document with a file upload and verification status is presented.
category: certificate
date: 2026-01-15
verification: self-reported
issuer: Example organisation
demo: true
tags: ['sample']
---

**Demonstration content.** This is not a real certificate. It exists to show the vault's metadata
and layout.

To publish a real document:

1. Put the PDF in `public/vault/` — for example `public/vault/certificates/2026-example.pdf`.
2. Add a Markdown file here with `file: /vault/certificates/2026-example.pdf`.
3. Set `verification` honestly: `verified` if the document is an official record, `self-reported`
   if it is descriptive, `in-progress` if it is not finished.

⚠️ Everything in `public/` is copied into the deployed site. Do not put private documents there.
