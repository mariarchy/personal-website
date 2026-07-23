# personal-website

My personal site: a landing page and a Markdown blog.

## Stack

- **[Astro](https://astro.build)**, static output — no client-side JS shipped unless a component opts into it later.
- **Plain CSS** with custom properties for the design tokens (`src/styles/global.css`) — no utility framework or component library.
- **Content Collections** for the blog (`src/content.config.ts`), authored in plain Markdown.
- Markdown runs on Astro's default `unified()` processor (remark/rehype), **not** the `@astrojs/markdown-satteri` alternative — the plugin ecosystem (GFM footnotes today; a future custom rehype plugin for sidenotes) depends on staying on `unified()`.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                        |
| `npm run dev`       | Start the local dev server at `localhost:4321` |
| `npm run build`     | Build the production site to `./dist/`      |
| `npm run preview`   | Preview the production build locally        |

Requires Node 22+ (see `.nvmrc`; run `nvm use` before the above if you have nvm installed).

## Writing a new post

Add a Markdown file to `src/content/blog/` with frontmatter:

```md
---
title: "Post title"
description: "One or two sentences — used in the post list, RSS, and social previews."
pubDate: 2026-07-23
tags: ["tag-one", "tag-two"] # optional
draft: false # set true to keep it out of the build until it's ready
---

Body copy in Markdown. GFM is on, so footnotes (`[^1]`), tables, and
strikethrough all work.
```

The filename becomes the URL slug (e.g. `on-unvalidated-measurements.md` → `/blog/on-unvalidated-measurements/`), so name the file the way you want the URL to read.

## Deployment

Hosted on Cloudflare, connected directly to this GitHub repo via **Workers Builds** (Cloudflare's current recommended path for new projects, ahead of classic Pages): every push to `main` runs the build command then the deploy command below, with preview deploys on other branches.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`wrangler.jsonc` points the deploy at the static build output (`./dist`); `npm run deploy` runs the same deploy command locally if needed. `astro.config.mjs`'s `site` value must match whatever domain is actually attached to the Workers project — update it there if the domain changes.

## Deliberately not here yet

MDX, a CMS, tag-index pages, the scroll-tracking table of contents, sidebar sidenotes, Tailwind, custom web fonts, and page-transition animations were all left out of v1 on purpose — see the project plan for the reasoning. None of them require restructuring anything above to add later.
