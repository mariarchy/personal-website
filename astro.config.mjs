// @ts-check
import sitemap from '@astrojs/sitemap';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { defineConfig } from 'astro/config';

import { transformerCodeTitle } from './src/lib/shiki-code-title.js';
import { transformerHashNotations } from './src/lib/shiki-notations.js';

// TODO: swap in the real custom domain once one is attached in Cloudflare Pages.
// site: process.env.CF_PAGES_URL || 'https://mariarchy.com'
// https://astro.build/config
export default defineConfig({
  site: 'https://mariarchy.com',
  redirects: {
    '/cv': {
      status: 302,
      destination:
        'https://drive.google.com/file/d/1JN9Hw03YDheRc1wAbQyhRsMW9hBQioEc/view?usp=sharing',
    },
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Warm light theme against the cream page; transformers add diff /
      // highlight classes that PostLayout styles.
      theme: 'rose-pine-dawn',
      wrap: false,
      transformers: [
        transformerCodeTitle(),
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerMetaHighlight(),
        transformerHashNotations(),
      ],
    },
  },
});
