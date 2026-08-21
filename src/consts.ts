/**
 * サイト全体で使う定数。
 * 数値・外部ID類はここに集約する(ページ側にハードコードしない)。
 */

export const SITE = {
  name: 'CARA Platform 日本版',
  title: 'CARA Platform 日本版 | 規制業界のためのコンテンツ・データ・プロセス管理',
  /** meta description。検索結果での省略を避けるため120文字以内に収める */
  description:
    'CARAは、製薬・製造など規制産業向けの文書・データ・業務プロセス統合管理プラットフォーム。作成・承認からAIの出力まで、すべての操作に監査証跡が残ります。',
  copyright: '© 2026 GENERIS — CARA PLATFORM JAPAN',
} as const;

/**
 * HubSpot 連携。
 * portalId / formId は未取得のため空。HubSpot側でフォーム作成後に設定する。
 * 空のあいだ HubspotForm.astro はプレースホルダーを表示する。
 */
export const HUBSPOT = {
  portalId: '',
  /** フォームのリージョン(例: 'na1' / 'eu1')。HubSpotアカウントに合わせて設定 */
  region: '',
  formIds: {
    /** TOP: 資料ダウンロード / デモ / 個別相談 */
    contact: '',
  },
} as const;

/**
 * ヒーロー下の統計帯。カウントアップの目標値。
 * 出典: 本社提供数値(2026-08時点)
 */
export const STATS = [
  { value: 750000, suffix: '+', label: '世界の利用ユーザー数' },
  { value: 40, suffix: '+', label: '利用されている国数' },
  { value: 400000, suffix: '+', label: '最大導入規模(ユーザー)' },
] as const;

/**
 * ウェビナー共通の文言。回ごとに変わらないものはMDXに持たせずここで管理する。
 * 出典: mocks/CARA_webinar_design_mock.html / CARA_webinar_detail_mock.html
 */
export const WEBINAR = {
  /** 詳細「当日のご案内」 */
  dayNotes: [
    { icon: 'i-check', text: '開始5分前から入室可能' },
    { icon: 'i-check', text: 'カメラ・マイクはオフでOK' },
    { icon: 'i-chat', text: '質問はチャットで随時受付' },
    { icon: 'i-check', text: '途中入退場自由' },
  ],
  /** 詳細「参加特典」/ 一覧の特典帯 */
  perkLead:
    'ウェビナー終了後、ご希望の方を無料デモ(個別相談付き)にご招待。「自社のどの業務に最も効くか」「既存システムとどう共存させるか」「導入の進め方」まで、貴社の状況に合わせて具体化します。業界別の参考資料(自動車/化学/製薬)も希望に応じて送付いたします。',
  perkItems: [
    '無料デモ(個別相談付き)へご招待',
    '業界別参考資料(自動車/化学/製薬)',
    'アーカイブ動画の視聴権',
  ],
  /** 詳細「注意事項」 */
  notes: [
    'リクルーティング、勧誘など、採用目的でのイベント参加はお断りしております。',
    '競合他社様のご参加はお断りする場合がございます。',
    '欠席される場合は、お手数ですが速やかにキャンセル処理をお願いいたします。',
    '無断キャンセルが続く場合、次回以降の参加をお断りする場合がございます。',
  ],
  /** 開催概要テーブルのうち、回によらず固定の行 */
  fee: '無料',
  organizer: 'Generis',
  environment: 'ネットワークが安定動作するPC環境',
  deadline: '申込締切: 開催前日 12:00まで',
  /** 一覧ページヘッダーのチップ */
  heroChips: [
    { icon: 'i-check', text: '参加無料' },
    { icon: 'i-monitor', text: 'オンライン開催' },
    { icon: 'i-check', text: 'カメラ・マイクOFF可' },
    { icon: 'i-check', text: '途中入退場自由' },
  ],
} as const;

/**
 * 資料(ホワイトペーパー)共通の文言。資料ごとに変わらないものはMDXに持たせずここで管理する。
 * 出典: mocks/CARA_whitepaper_list_mock.html / CARA_whitepaper_detail_mock.html
 */
export const WHITEPAPER = {
  /** カテゴリタブ。key='all' は絞り込み解除 */
  tabs: [
    { key: 'all', label: 'すべて' },
    { key: 'product', label: '製品資料' },
    { key: 'whitepaper', label: 'ホワイトペーパー' },
    { key: 'industry', label: '業界別資料' },
  ],
  /** category → 表示ラベル / タグの色クラス / アイコン */
  categoryMeta: {
    product: { label: '製品資料', tag: 't-product', icon: 'i-doc' },
    whitepaper: { label: 'ホワイトペーパー', tag: 't-wp', icon: 'i-doc' },
    industry: { label: '業界別資料', tag: 't-ind', icon: 'i-factory' },
  },
  /** 一覧ページヘッダーの導線説明 */
  flow: [
    { icon: 'i-form', text: 'フォーム入力(1分)' },
    { icon: 'i-dl', text: 'サンクスページからDL' },
    { icon: 'i-mail', text: '自動返信メールでもお届け' },
  ],
  /** 資料概要テーブルのうち、資料によらず固定の行 */
  fee: '無料',
  publisher: 'Generis',
  delivery: 'フォーム送信後、サンクスページおよび自動返信メールにてダウンロードURLをご案内',
  /** サイドDLカード */
  dlHeading: '無料ダウンロード',
  dlSub: '下記フォームご入力後、すぐにご覧いただけます(入力目安1分)。',
  dlFlow: '送信後、サンクスページに移動します\nダウンロードURLはメールでもお届け',
} as const;

/**
 * 導入事例ロゴのマーキー表示。file は public/images/logos/ 配下のファイル名。
 * ※ 実名・実ロゴの掲載可否は本社確認前。掲載可否が未確定のため、
 *    確認が取れるまで公開前に差し替えるか非表示にすること。
 * ※ ロゴ原本は assets-src/logos/(グローバルサイト配布物のまま)。
 *    public/images/logos/ 側は viewBox の余白のみ詰めた表示用コピー。
 * ※ qvc / ameritas / cdcr / sacramento は取得済みだが今回は未使用。
 */
export const CUSTOMER_LOGOS = [
  { name: 'Bayer', file: 'bayer.svg' },
  { name: 'Pfizer', file: 'pfizer.svg' },
  { name: 'Merck', file: 'merck.svg' },
  { name: 'Reckitt', file: 'reckitt.svg' },
  { name: 'Sargento', file: 'sargento.svg' },
  { name: 'Visa', file: 'visa.svg' },
  { name: 'Fannie Mae', file: 'fannie-mae.svg' },
  { name: 'DHS', file: 'dhs.svg' },
] as const;
