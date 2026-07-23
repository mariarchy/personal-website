// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// TODO: swap in the real custom domain once one is attached in Cloudflare Pages.
// site: process.env.CF_PAGES_URL || 'https://mariarchy.com'
// https://astro.build/config
export default defineConfig({
  site: 'https://mariarchy.com',
  integrations: [sitemap()]
});