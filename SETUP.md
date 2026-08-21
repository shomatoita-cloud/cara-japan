# SETUP.md — Claude Codeでの立ち上げ手順

このキットからCARA日本版サイトの開発を始める手順です。

## 0. 前提

- Node.js 20以上 / npm
- Claude Code(ターミナル or デスクトップアプリ)
- GitHubアカウント(デプロイ用) / Vercelアカウント(無料でOK)

## 1. リポジトリ準備(2分)

```bash
mkdir cara-japan && cd cara-japan
# このキットの中身を展開してコピー:
#   CLAUDE.md          → リポジトリ直下
#   mocks/             → リポジトリ直下(デザインモック5点)
#   assets-src/        → リポジトリ直下(SVG素材4点)
git init
```

## 2. Claude Codeで初期構築

リポジトリ直下で Claude Code を起動し、最初にこう指示:

```
CLAUDE.mdを読んで。mocks/ の5つのHTMLモックを正として、
Astroプロジェクトを初期化してください。
まずは tokens.css・Base.astro・Header/Footer/StickyCta と
TOPページ(index.astro)を mocks/CARA_TOP_design_mock.html から移植。
HubSpotのportalId/formIdは仮の定数でOK。
npm run dev で確認できる状態にして。
```

TOPの見た目がモックと一致したら、続けて:

```
次に webinars(一覧・詳細)と whitepapers(一覧・詳細)を
Content Collections化して移植。mocks/ の該当HTMLを正とする。
サンプルデータとして mocks 内の文言でMDXを各2件作成して。
```

```
thanks/[slug] ページと blog を作成。CLAUDE.mdのスキーマに従うこと。
```

## 3. 動作確認ポイント

- [ ] TOP: 統計カウントアップ/ロゴマーキー/モバイル固定CTAが動く
- [ ] ウェビナー: MDX追加だけで一覧・詳細に反映される
- [ ] 資料: featured指定で「まずはこちら」枠に出る
- [ ] スマホ実機でダークモードでも白背景のまま(color-scheme対応)

## 4. HubSpot接続

1. HubSpotでフォーム作成(TOP問い合わせ/ウェビナー申込/資料DL×資料数)
2. 各フォームの portalId / formId を `src/consts.ts` に設定
3. フォームの送信後リダイレクト先を `/thanks/対応slug` に設定
4. 資料DL用ワークフロー(自動返信メールにfileUrl)をHubSpot側で作成
5. テスト送信 → サンクスページ表示+メール受信を確認

## 5. デプロイ(Vercel)

```bash
git add -A && git commit -m "initial site"
# GitHubにpush後、VercelでImport → フレームワーク自動検出(Astro)→ Deploy
```

- 独自ドメイン(generis-japan.com 等)をVercelのDomainsで接続
- 公開前チェック: OGP画像 / favicon / sitemap(@astrojs/sitemap)/ 主要ページのtitle・description

## 6. 運用(コンテンツ更新)

更新はすべてClaude Codeへの一言でOK:

- 「10/15のウェビナーを追加して。タイトルは◯◯、アジェンダは…」
- 「6/23回をアーカイブに変更、動画URLは◯◯」
- 「◯◯についてのSEO記事を書いて追加して」

コミット→pushでVercelが自動デプロイします。
