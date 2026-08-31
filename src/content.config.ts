// astro:content からの z は非推奨のため zod を直接使う
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * ウェビナー(1件 = 1 MDX)
 * ファイル名は YYYYMMDD-slug.mdx。ファイル名がそのまま URL のスラッグになる
 * (例: 20260929-manufacturing-ai.mdx → /webinars/20260929-manufacturing-ai/)。
 *
 * 一覧・詳細はこのコレクションから自動生成されるため、MDXを追加するだけで反映される。
 */
const webinars = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/webinars' }),
  schema: z.object({
    title: z.string(),
    /** 開催日 'YYYY-MM-DD' */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date は 'YYYY-MM-DD' 形式で指定してください"),
    /** 例: '15:00–16:00'(区切りは en dash) */
    timeLabel: z.string(),
    status: z.enum(['upcoming', 'archive']),
    /** 例: 'オンライン(Zoom)' */
    format: z.string(),
    /** 例: '定員20名・先着順' ※残席数の表示機能は作らない(CLAUDE.md 決定事項) */
    capacity: z.string(),
    tags: z.array(z.string()),
    /** 詳細ページの概要リード兼 meta description */
    description: z.string(),
    /** 当日お伝えする軸 */
    agenda: z.array(z.object({ title: z.string(), body: z.string() })),
    speaker: z.object({ name: z.string(), role: z.string(), bio: z.string() }),
    hubspotFormId: z.string(),
    /** status=archive のとき必須 */
    archiveVideoUrl: z.string().optional(),

    // --- 以下は CLAUDE.md のスキーマにない追加項目 ---
    // 詳細モック(CARA_webinar_detail_mock.html)の「こんな方におすすめ」は
    // 回ごとに内容が変わるため、任意項目として追加している。
    // 未指定なら該当ブロックを描画しない。
    recommendedFor: z.array(z.string()).optional(),
    /** 一覧の meta チップ(例: '実演デモあり')。未指定なら形式・無料のみ表示 */
    highlight: z.string().optional(),
  }),
});

/**
 * 資料 / ホワイトペーパー(1件 = 1 MDX)
 * ファイル名がそのまま URL のスラッグになる
 * (例: hidden-costs.mdx → /whitepapers/hidden-costs/ と /thanks/hidden-costs/)。
 */
const whitepapers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/whitepapers' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['product', 'whitepaper', 'industry']),
    description: z.string(),
    /** 例: '全24ページ' */
    pages: z.string().optional(),
    /** 例: '読了目安 10分' */
    readTime: z.string().optional(),
    /** この資料でわかること */
    learnPoints: z.array(z.string()),
    toc: z.array(z.object({ title: z.string(), sub: z.string().optional() })),
    hubspotFormId: z.string(),
    /** HubSpotファイルURL(サンクスページ/自動返信メールで配布) */
    fileUrl: z.string(),
    /** 一覧の「まずはこちら」枠に出す */
    featured: z.boolean().optional(),

    // --- 以下は CLAUDE.md のスキーマにない追加項目 ---
    // 詳細モック(CARA_whitepaper_detail_mock.html)を再現するために必要な項目。
    /** CSS描画のPDF表紙。Cover.astro に渡す */
    cover: z.object({
      label: z.string(),
      /** 表紙のタイトル(配列1要素 = 1行) */
      title: z.array(z.string()),
      sub: z.string(),
      variant: z.enum(['light', 'blue', 'teal']).default('light'),
      /** variant='light' のときの差し色 */
      accent: z.enum(['blue', 'teal', 'coral']).optional(),
    }),
    /** 「この資料について」のキーナンバー(3つ想定)。未指定なら描画しない */
    keyStats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    /** 「こんな方におすすめ」。未指定ならブロックごと描画しない */
    recommendedFor: z.array(z.string()).optional(),
  }),
});

/**
 * ブログ記事(1件 = 1 MDX)
 * ファイル名がそのまま URL のスラッグになる(例: ai-audit.mdx → /blog/ai-audit/)。
 * 一覧・詳細はこのコレクションから自動生成されるため、MDXを追加するだけで反映される。
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** 公開日 'YYYY-MM-DD' */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date は 'YYYY-MM-DD' 形式で指定してください"),
    /** 一覧の抜粋兼 meta description */
    description: z.string(),
    tags: z.array(z.string()),
    /** アイキャッチ画像のパス(public/images/ 配下)。未指定ならグラデ背景で代替する */
    cover: z.string().optional(),
  }),
});

export const collections = { webinars, whitepapers, blog };
