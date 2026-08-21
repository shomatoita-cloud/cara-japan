// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  // 本番ドメイン。sitemap/canonical/OGPの絶対URL生成に使用する
  site: 'https://generis-japan.com',

  integrations: [
    mdx(),
    sitemap({
      // /thanks/ 配下はフォーム送信後の着地点で noindex を出しているため、
      // サイトマップにも載せない(noindexページの送信は Search Console で警告になる)。
      // public/robots.txt の Disallow と対で運用する。
      filter: (page) => !new URL(page).pathname.startsWith('/thanks/'),
    }),
  ],
});
