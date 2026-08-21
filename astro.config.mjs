// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  // 本番ドメイン確定後に差し替え(sitemap/OGPの絶対URL生成に使用)
  site: 'https://example.com',

  integrations: [mdx()],
});