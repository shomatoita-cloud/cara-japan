# CLAUDE.md — CARA Platform 日本版サイト

このリポジトリは Generis「CARA Platform」の日本版マーケティングサイト。
Claude Codeはこのファイルの規約に従って開発すること。

## プロジェクト概要

- 目的: 日本市場向けのリード獲得サイト(広告LP型TOP+ウェビナー/資料/ブログ)
- ターゲット: 製薬・自動車・化学など製造業の薬事/品質/監査/DX担当者
- 最重要KPI: 問い合わせ・資料ダウンロード(HubSpotフォーム経由)
- デザインの完成形は `mocks/` 内のHTML5点。**実装はこのモックのピクセル・文言を正とする**

## 技術スタック

- フレームワーク: **Astro**(静的出力 `output: 'static'`)
- スタイル: グローバルCSS + CSS変数(`src/styles/tokens.css`)。TailwindやCSS-in-JSは使わない(モックのCSSを移植する方針のため)
- コンテンツ: Astro Content Collections(MDX)
- フォーム: HubSpot埋め込み(スクリプト埋め込み方式)。自前のフォーム実装は禁止
- ホスティング: Vercel
- パッケージマネージャ: npm

## コマンド

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド(型チェック含む)
npm run preview  # ビルド確認
```

変更をコミットする前に必ず `npm run build` が通ることを確認する。

## ディレクトリ構成

`※未` = 未実装(今後のフェーズで作成予定)。それ以外は実在するファイル。

```
src/
├── consts.ts                # 定数の集約(統計数値/HubSpot ID/導入企業ロゴ/WEBINAR共通文言)
├── content.config.ts        # コレクションスキーマ(下記)※Astro 7 では src 直下が必須
│                            #   (旧 src/content/config.ts はAstro 7で廃止・ビルドエラーになる)
├── styles/
│   ├── tokens.css           # デザイントークン(下記)+ リセット。色・角丸・影はここのCSS変数のみ使用
│   ├── global.css           # 全ページ共通パーツ(.btn / .trail / h2 / .lead / section)
│   ├── top.css              # TOP専用のセクションCSS(モックから1:1移植)
│   └── webinar.css          # ウェビナー一覧・詳細のCSS(body の .webinar-list / .webinar-detail 配下)
├── layouts/
│   └── Base.astro           # 共通レイアウト(head/ヘッダー/フッター/固定CTA/共通JS)
├── components/
│   ├── Header.astro         # 固定ヘッダー(ロゴ+ナビ+資料DLボタン)
│   ├── Footer.astro         # ロゴ+コピーライト
│   ├── StickyCta.astro      # モバイル下部固定CTA(info指定で詳細ページ用の2カラム版)
│   ├── SectionLabel.astro   # 白ピル+青文字の英字ラベル(.trail)
│   ├── Breadcrumbs.astro    # パンくず(下層ページ用)
│   ├── IconSprite.astro     # SVGアイコンのsymbol定義。Baseがbody先頭で1回だけ出力
│   └── HubspotForm.astro    # HubSpotフォーム埋め込み(ID未設定のあいだはプレースホルダー)
├── lib/
│   └── webinars.ts          # 開催予定/アーカイブの振り分け・日付整形・Googleカレンダー URL
├── content/                 # MDX本体のみ。スキーマ定義は src/content.config.ts
│   ├── webinars/            # ウェビナー(1件=1mdx。ファイル名 YYYYMMDD-slug がURLスラッグになる)
│   ├── whitepapers/         # 資料(1件=1mdx) ※未
│   └── blog/                # 記事(1件=1mdx) ※未
└── pages/
    ├── index.astro          # TOP(mocks/CARA_TOP_design_mock.html準拠)
    ├── webinars/index.astro # 一覧(mocks/CARA_webinar_design_mock.html準拠)
    ├── webinars/[slug].astro # 詳細(mocks/CARA_webinar_detail_mock.html準拠)
    ├── whitepapers/index.astro   ※未
    ├── whitepapers/[slug].astro  ※未
    ├── blog/index.astro          ※未
    ├── blog/[slug].astro         ※未
    └── thanks/[slug].astro       ※未(資料DL/申込のサンクスページ)

public/                      # そのまま配信される。ビルド時の加工はされない
├── favicon.svg              # CARAロゴのスウッシュ3枚 + 青グラデ角丸背景
└── images/
    ├── cara_logo_color.svg  # ヘッダー/フッター用(ワードマーク=ink / スウッシュ=blue)
    ├── cara_logo_white.svg  # 青グラデ背景用(全パーツ白)※現状は参照箇所なし
    ├── hero_illustration.svg    # TOPヒーロー。浮遊アニメはSVG内部に持たせている
    ├── reason_01_audit.svg       # TOP「3つの理由」01
    ├── reason_02_license.svg     # 同 02
    ├── reason_03_integration.svg # 同 03
    └── logos/               # 導入企業ロゴ12点(表示用にviewBoxの余白を詰めたコピー)

assets-src/                  # 原本(無加工)。加工したコピーを public/ に置く
├── cara_logo_white.svg      # 公式ロゴ(全パーツ白)
├── hero_illustration.svg
├── reason_01_audit.svg
├── reason_02_license.svg
├── reason_03_integration.svg
└── logos/                   # 導入企業ロゴ12点の原本(ダウンロードしたまま)
```

## デザイントークン(tokens.css)

モックの`:root`と完全一致させる。**ハードコードで色を書かない**こと。

```css
:root{
  color-scheme:light only;
  --bg:#FFFFFF; --tint:#F8FBFE; --tint2:#F0F6FD;
  --ink:#1F3350; --ink-soft:#42536C;
  --blue:#2E6BD6; --blue-deep:#1F4FA8; --sky:#C7DDF7;
  --teal:#1FA48E; --teal-soft:#EAF9F5;
  --coral:#F0653F; --line:#E9F0F8;
  --grad:linear-gradient(118deg,#1F4FA8 0%,#2E6BD6 48%,#3F9BE8 100%);
  --grad-soft:linear-gradient(118deg,#2E6BD6,#3F9BE8);
  --mono:'IBM Plex Mono',monospace;
  --sans:'Noto Sans JP',sans-serif;
}
```

- フォント読み込み: Google Fonts(Noto Sans JP 400/500/700/900, IBM Plex Mono 400/500)
- `<meta name="color-scheme" content="light only">` を全ページに必ず入れる(ダークモード反転防止)
- ボタンはピル型(border-radius:999px)。CTA=coral、通常=blue
- カード角丸16〜22px、影はモックの値を移植

## コンテンツスキーマ(src/content.config.ts)

```ts
webinars: {
  title: string
  date: string            // '2026-09-30'
  timeLabel: string       // '15:00–16:00'
  status: 'upcoming' | 'archive'
  format: string          // 'オンライン(Zoom)'
  capacity: string        // '定員20名・先着順' ※残席数の表示機能は作らない
  tags: string[]
  description: string
  agenda: { title: string; body: string }[]
  speaker: { name: string; role: string; bio: string }
  hubspotFormId: string
  archiveVideoUrl?: string  // status=archiveのとき
  recommendedFor?: string[] // 「こんな方におすすめ」。未指定なら詳細のブロックごと非表示
  highlight?: string        // 一覧カードのチップ(例 '実演デモあり')。未指定なら出さない
}

whitepapers: {
  title: string
  category: 'product' | 'whitepaper' | 'industry'
  description: string
  pages?: string          // '全24ページ'
  readTime?: string       // '読了目安 10分'
  learnPoints: string[]   // この資料でわかること
  toc: { title: string; sub?: string }[]
  hubspotFormId: string
  fileUrl: string         // HubSpotファイルURL(サンクス/メールで配布)
  featured?: boolean      // 一覧の「まずはこちら」枠
}

blog: {
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
}
```

## コンテンツ追加の手順(ユーザーが依頼したとき)

- 「ウェビナー追加して」→ `src/content/webinars/YYYYMMDD-slug.mdx` を作成。一覧・詳細は自動生成されるのでページ側は触らない
- 「資料追加して」→ 同様に whitepapers に追加+`thanks/[slug]` が自動で対応するか確認
- 開催が終わったウェビナーは `status: 'archive'` に変更し `archiveVideoUrl` を設定
- 記事は `blog/` にMDX追加。SEOを意識しtitle/descriptionを必ず設定

## HubSpotルール

- フォームは `HubspotForm.astro` 経由でのみ埋め込む(portalId/formIdをpropsで受ける)
- 送信後の遷移: HubSpot側設定でサンクスページ(`/thanks/[slug]`)へリダイレクト
- 資料配布: サンクスページに `fileUrl` のDLリンク+HubSpotワークフローの自動返信メール(コード側は関与しない)
- 残席数表示は実装しない(決定事項)

## 実装上の決まり

- モックにあるアニメーション(スクロール出現/カウントアップ/マーキー/浮遊)は素のJSで移植。`prefers-reduced-motion` 対応を必ず維持
- 画像は `public/images/`。イラストはSVGのまま使用(`assets-src/` に原本)
- 事例の実名(BAYER/PFIZER/MERCK)は本社確認前。掲載可否が未確定である旨のコメントをコードに残す
- 数値(75万ユーザー等)は定数ファイル `src/consts.ts` に集約
- 回によらない共通文言(ウェビナーの当日の案内・注意事項・参加特典・参加費・主催・推奨環境・申込締切など)は `src/consts.ts` の `WEBINAR` に集約し、MDXには持たせない
- レスポンシブ: モバイル(〜760px)でモックの固定CTAバー表示を再現
- コピーライト表記: © 2026 GENERIS — CARA PLATFORM JAPAN

## やらないこと

- Tailwind等への置き換え / デザインの独自アレンジ(変更はユーザー指示があった場合のみ)
- 自前フォーム・自前メール送信の実装
- 残席数のカウント機能
- ダークモード対応(ライト固定)
