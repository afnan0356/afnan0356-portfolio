# Stage 2.3 — actual before/after screenshots

All images are actual local Chromium captures of the preserved Stage 2.2 baseline or final Stage 2.3 build. No generated mockups, invented interfaces or retouched screenshot content. Both sets use 1440/390px widths and a 1000px viewport height; full-page image height follows the document.

**B = before, A = after.** Both themes shown. Six-width responsive testing lives in the JSON/browser reports; this visual index is desktop + phone.

| Page | Dark desktop · 1440 | Dark phone · 390 | Light desktop · 1440 | Light phone · 390 |
| --- | --- | --- | --- | --- |
| Home | [B](before/home-dark-1440.png) / [A](after/home-dark-1440.png) | [B](before/home-dark-390.png) / [A](after/home-dark-390.png) | [B](before/home-light-1440.png) / [A](after/home-light-1440.png) | [B](before/home-light-390.png) / [A](after/home-light-390.png) |
| About | [B](before/about-dark-1440.png) / [A](after/about-dark-1440.png) | [B](before/about-dark-390.png) / [A](after/about-dark-390.png) | [B](before/about-light-1440.png) / [A](after/about-light-1440.png) | [B](before/about-light-390.png) / [A](after/about-light-390.png) |
| Projects | [B](before/projects-dark-1440.png) / [A](after/projects-dark-1440.png) | [B](before/projects-dark-390.png) / [A](after/projects-dark-390.png) | [B](before/projects-light-1440.png) / [A](after/projects-light-1440.png) | [B](before/projects-light-390.png) / [A](after/projects-light-390.png) |
| Nyayota | [B](before/projects-nyayota-dark-1440.png) / [A](after/projects-nyayota-dark-1440.png) | [B](before/projects-nyayota-dark-390.png) / [A](after/projects-nyayota-dark-390.png) | [B](before/projects-nyayota-light-1440.png) / [A](after/projects-nyayota-light-1440.png) | [B](before/projects-nyayota-light-390.png) / [A](after/projects-nyayota-light-390.png) |
| CV | [B](before/cv-dark-1440.png) / [A](after/cv-dark-1440.png) | [B](before/cv-dark-390.png) / [A](after/cv-dark-390.png) | [B](before/cv-light-1440.png) / [A](after/cv-light-1440.png) | [B](before/cv-light-390.png) / [A](after/cv-light-390.png) |
| Vault | [B](before/vault-dark-1440.png) / [A](after/vault-dark-1440.png) | [B](before/vault-dark-390.png) / [A](after/vault-dark-390.png) | [B](before/vault-light-1440.png) / [A](after/vault-light-1440.png) | [B](before/vault-light-390.png) / [A](after/vault-light-390.png) |
| Vault category | [B](before/vault-category-evidence-dark-1440.png) / [A](after/vault-category-evidence-dark-1440.png) | [B](before/vault-category-evidence-dark-390.png) / [A](after/vault-category-evidence-dark-390.png) | [B](before/vault-category-evidence-light-1440.png) / [A](after/vault-category-evidence-light-1440.png) | [B](before/vault-category-evidence-light-390.png) / [A](after/vault-category-evidence-light-390.png) |
| Blog | [B](before/blog-dark-1440.png) / [A](after/blog-dark-1440.png) | [B](before/blog-dark-390.png) / [A](after/blog-dark-390.png) | [B](before/blog-light-1440.png) / [A](after/blog-light-1440.png) | [B](before/blog-light-390.png) / [A](after/blog-light-390.png) |
| Writing | [B](before/writing-dark-1440.png) / [A](after/writing-dark-1440.png) | [B](before/writing-dark-390.png) / [A](after/writing-dark-390.png) | [B](before/writing-light-1440.png) / [A](after/writing-light-1440.png) | [B](before/writing-light-390.png) / [A](after/writing-light-390.png) |
| Contact | [B](before/contact-dark-1440.png) / [A](after/contact-dark-1440.png) | [B](before/contact-dark-390.png) / [A](after/contact-dark-390.png) | [B](before/contact-light-1440.png) / [A](after/contact-light-1440.png) | [B](before/contact-light-390.png) / [A](after/contact-light-390.png) |
| 404 | [B](before/404.html-dark-1440.png) / [A](after/404.html-dark-1440.png) | [B](before/404.html-dark-390.png) / [A](after/404.html-dark-390.png) | [B](before/404.html-light-1440.png) / [A](after/404.html-light-1440.png) | [B](before/404.html-light-390.png) / [A](after/404.html-light-390.png) |

## Baseline capture caveat

The light desktop Projects full-page baseline contains an offscreen image-paint artifact. A genuine pre-edit scrolled viewport showed the decoded screenshot correctly: [correct pre-edit viewport](before/projects-light-1440-viewport.png). Do not treat the blank pixels in that full-page capture as a website bug or as a design improvement. Final captures visit images and wait for painting before returning to the top.

## Focused reading and interaction evidence

| Detail | Dark desktop | Light phone |
| --- | --- | --- |
| Information model | [View](after/case-information-architecture-dark-1440.png) | [View](after/case-information-architecture-light-390.png) |
| AI-assisted workflow | [View](after/case-workflow-dark-1440.png) | [View](after/case-workflow-light-390.png) |
| Technical decisions | [View](after/case-decisions-dark-1440.png) | [View](after/case-decisions-light-390.png) |
| Screenshot inspector | [View](after/image-inspector-dark-1440.png) | [View](after/image-inspector-light-390.png) |

[Home without JavaScript](after/home-nojs-dark-1440.png) · [CV PDF from dark theme](after/cv-print-dark.pdf) · [CV PDF from light theme](after/cv-print-light.pdf) · [Dark-origin print rasterization](after/cv-print-dark.png) · [Light-origin print rasterization](after/cv-print-light.png)

Print outputs are current-content Chromium A4, not physical-printer certification. Intermediate group captures are retained under group1/, group2/ and group3/ for review chronology; final evidence is under after/.

[Return to report](REPORT.md)
